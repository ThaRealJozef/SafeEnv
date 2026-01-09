import * as vscode from 'vscode';
import { LicenseService, Plan } from '../services/LicenseService';
import { VSCodeConfigService } from '../services/VSCodeConfigService';

/**
 * WebviewViewProvider for the GhostVault Control Center sidebar.
 * Manages the webview UI and handles message passing between frontend and backend.
 */
export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'safeenv.controlCenter';

    private _view?: vscode.WebviewView;
    private readonly _extensionUri: vscode.Uri;
    private readonly _licenseService: LicenseService;
    private readonly _configService: VSCodeConfigService;

    private readonly _context: vscode.ExtensionContext;

    constructor(
        context: vscode.ExtensionContext,
        extensionUri: vscode.Uri,
        licenseService: LicenseService,
        configService: VSCodeConfigService
    ) {
        this._context = context;
        this._extensionUri = extensionUri;
        this._licenseService = licenseService;
        this._configService = configService;
    }


    private _getSecretsBlockedCount(): number {
        return this._context.globalState.get<number>('safeenv.secretsBlocked', 0);
    }

    public async resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            try {
                switch (message.command) {
                    case 'activateLicense':
                        await this._handleActivateLicense(message.key);
                        break;
                    case 'requestAddPattern':
                        await this._handleRequestAddPattern();
                        break;
                    case 'addPattern':
                        await this._handleAddPattern(message.payload);
                        break;
                    case 'deletePattern':
                        await this._handleDeletePattern(message.payload.id);
                        break;
                    case 'refresh':
                        await this._postUpdate(await this._licenseService.getPlan());
                        break;
                    case 'deactivateLicense':
                        await this._handleDeactivateLicense();
                        break;
                }
            } catch (error) {
                this._view?.webview.postMessage({
                    command: 'error',
                    message: error instanceof Error ? error.message : 'An error occurred',
                });
            }
        });

        // Send initial state
        await this._postUpdate(await this._licenseService.getPlan());

        // Auto-refresh when configuration changes
        const changeDisposable = vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration('safeenv.customPatterns')) {
                await this._postUpdate(await this._licenseService.getPlan());
            }
        });

        // Auto-refresh when view becomes visible
        const viewStateDisposable = webviewView.onDidChangeVisibility(async () => {
            if (webviewView.visible) {
                await this._postUpdate(await this._licenseService.getPlan());
            }
        });

        // Dispose listeners when webview is closed
        webviewView.onDidDispose(() => {
            changeDisposable.dispose();
            viewStateDisposable.dispose();
        });
    }

    private async _handleDeactivateLicense(): Promise<void> {
        await this._licenseService.clearLicense();
        vscode.window.showInformationMessage('License deactivated successfully.');
        await this._postUpdate(await this._licenseService.getPlan());
    }

    private async _handleActivateLicense(key: string): Promise<void> {
        const isValid = await this._licenseService.verifyKey(key);
        const plan = await this._licenseService.getPlan();

        if (isValid) {
            vscode.window.showInformationMessage('Pro license activated!');
        } else {
            vscode.window.showErrorMessage('Invalid license key. Try "PRO-DEMO-KEY" for demo.');
        }

        await this._postUpdate(plan);
    }

    private async _postUpdate(plan: Plan): Promise<void> {
        try {
            const config = await this._configService.load();
            const secretsBlocked = this._getSecretsBlockedCount();

            this._view?.webview.postMessage({
                command: 'updateState',
                payload: {
                    isPro: plan === 'PRO',
                    maxPatterns: this._licenseService.getMaxPatterns(),
                    patternCount: config.customPatterns.length,
                    secretsBlocked: secretsBlocked,
                    patterns: config.customPatterns,
                },
            });
        } catch (error) {
            this._view?.webview.postMessage({
                command: 'error',
                message: 'Failed to load configuration',
            });
        }
    }



    private async _handleRequestAddPattern(): Promise<void> {
        const name = await vscode.window.showInputBox({
            prompt: 'Enter Pattern Name',
            placeHolder: 'e.g., ACME Internal Key'
        });
        if (!name) return;

        const regex = await vscode.window.showInputBox({
            prompt: 'Enter Regex Pattern',
            placeHolder: 'e.g., \\bACME_[0-9]+\\b'
        });
        if (!regex) return;

        const provider = await vscode.window.showInputBox({
            prompt: 'Enter Provider Name',
            placeHolder: 'e.g., ACME Corp'
        });
        if (!provider) return;

        const type = await vscode.window.showInputBox({
            prompt: 'Enter Token Type',
            placeHolder: 'e.g., API Key'
        });
        if (!type) return;

        const pattern = {
            id: 'custom_' + Date.now(),
            name,
            regex,
            provider,
            type,
            enabled: true
        };

        await this._handleAddPattern(pattern);
    }

    private async _handleAddPattern(payload: any): Promise<void> {
        const config = await this._configService.load();
        const plan = await this._licenseService.getPlan();

        if (plan === 'FREE' && config.customPatterns.length >= 1) {
            // Do not add; Webview already handles "Upgrade" prompt
            return;
        }

        config.customPatterns.push(payload);
        await this._configService.save({ customPatterns: config.customPatterns });
        await this._postUpdate(plan);
    }

    private async _handleDeletePattern(id: string): Promise<void> {
        const config = await this._configService.load();
        const plan = await this._licenseService.getPlan();

        config.customPatterns = config.customPatterns.filter(p => p.id !== id);
        await this._configService.save({ customPatterns: config.customPatterns });
        await this._postUpdate(plan);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'src', 'ui', 'webview', 'main.js')
        ).with({ 'query': `t=${Date.now()}` });
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'src', 'ui', 'webview', 'style.css')
        );
        const nonce = this._getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; 
                   style-src ${webview.cspSource} 'unsafe-inline'; 
                   script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>GhostVault Control Center</title>
</head>
<body>
    <div id="app">
        <header>
            <h1>GhostVault</h1>
            <button id="refresh-btn" title="Refresh Dashboard">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 4v6h-6"></path>
                    <path d="M1 20v-6h6"></path>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
            </button>
        </header>

        <section id="dashboard">
            <h2>📊 Dashboard</h2>
            <div class="stat-card">
                <span id="secrets-blocked">0</span>
                <label>Secrets Blocked</label>
            </div>
        </section>
        <section id="patterns">
            <h2>🛡️ Custom Patterns</h2>
            <div id="pattern-header">
                <p id="pattern-counter">Slots: 0/1</p>
            </div>
            <ul id="pattern-list"></ul>
            <button id="add-pattern-btn" class="primary-btn">+ Add Pattern</button>
            <button id="sync-btn" class="secondary-btn" disabled>☁️ Sync 🔒</button>
        </section>
        <section id="settings">
            <h2>⚙️ Settings</h2>
            <div id="license-form">
                <input type="text" id="license-input" placeholder="Enter License Key (e.g. PRO-DEMO-KEY)">
                <button id="activate-btn" class="primary-btn">Activate Pro</button>
            </div>
            <div id="pro-status" style="display: none;">
                <div class="pattern-item" style="border-color: var(--pro-gold); background: rgba(251, 191, 36, 0.1);">
                    <div class="name" style="display: flex; align-items: center; gap: 8px;">
                        <span>🏆 Pro License Active</span>
                    </div>
                </div>
                <button id="deactivate-btn" class="secondary-btn" style="color: var(--accent-red); border-color: var(--accent-red);">Deactivate License</button>
            </div>
        </section>
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
    }

    private _getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
