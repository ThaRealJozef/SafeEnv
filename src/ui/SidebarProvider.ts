import * as vscode from 'vscode';
import { LicenseService, Plan } from '../services/LicenseService';
import { VSCodeConfigService } from '../services/VSCodeConfigService';

export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'safeenv.controlCenter';

    private view?: vscode.WebviewView;
    private readonly extUri: vscode.Uri;
    private readonly license: LicenseService;
    private readonly config: VSCodeConfigService;
    private readonly ctx: vscode.ExtensionContext;

    constructor(
        context: vscode.ExtensionContext,
        extensionUri: vscode.Uri,
        licenseService: LicenseService,
        configService: VSCodeConfigService
    ) {
        this.ctx = context;
        this.extUri = extensionUri;
        this.license = licenseService;
        this.config = configService;
    }

    private getBlockedCount(): number {
        return this.ctx.globalState.get<number>('safeenv.secretsBlocked', 0);
    }

    public async resolveWebviewView(webviewView: vscode.WebviewView) {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extUri],
        };

        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (msg) => {
            switch (msg.command) {
                case 'activate':
                    await this.handleActivate(msg.key);
                    break;
                case 'deactivate':
                    await this.handleDeactivate();
                    break;
                case 'addPattern':
                    await this.handleAddPattern();
                    break;
                case 'deletePattern':
                    await this.handleDeletePattern(msg.id);
                    break;
                case 'sync':
                    await this.handleSync();
                    break;
                case 'refresh':
                    await this.postState();
                    break;
                case 'paste':
                    const text = await vscode.env.clipboard.readText();
                    this.view?.webview.postMessage({ command: 'pasted', text });
                    break;
            }
        });

        await this.postState();

        webviewView.onDidChangeVisibility(async () => {
            if (webviewView.visible) await this.postState();
        });
    }

    private async handleActivate(key: string) {
        const valid = await this.license.verifyKey(key);
        if (valid) {
            vscode.window.showInformationMessage('SafeEnv Pro activated!');
        } else {
            vscode.window.showErrorMessage('Invalid license key.');
        }
        await this.postState();
    }

    private async handleDeactivate() {
        const confirm = await vscode.window.showWarningMessage('Deactivate SafeEnv Pro license?', 'Yes', 'No');
        if (confirm === 'Yes') {
            await this.license.clearLicense();
            vscode.window.showInformationMessage('License deactivated');
            await this.postState();
        }
    }

    private async handleSync() {
        try {
            const patterns = await this.license.syncPatterns();
            vscode.window.showInformationMessage(`Synced ${patterns.length} Pro patterns from SafeEnv Cloud!`);
            await this.postState();
        } catch (e) {
            vscode.window.showErrorMessage(e instanceof Error ? e.message : 'Sync failed');
        }
    }

    private async handleAddPattern() {
        const cfg = await this.config.load();
        const plan = await this.license.getPlan();

        if (plan === 'FREE' && cfg.customPatterns.length >= 1) {
            const action = await vscode.window.showWarningMessage(
                'Free tier is limited to 1 custom pattern.',
                'Get SafeEnv Pro',
                'Cancel'
            );
            if (action === 'Get SafeEnv Pro') {
                vscode.env.openExternal(vscode.Uri.parse('https://safeenv.lemonsqueezy.com/buy'));
            }
            return;
        }

        // Step 1: What type of secret?
        const secretType = await vscode.window.showQuickPick(
            ['API Key', 'Access Token', 'Secret Key', 'Password', 'Other'],
            { placeHolder: 'Step 1/3: What type of secret are you protecting?' }
        );
        if (!secretType) return;

        // Step 2: What prefix does it start with?
        const prefix = await vscode.window.showInputBox({
            prompt: 'Step 2/3: What prefix does your secret start with?',
            placeHolder: 'e.g., sk_, my_api_, ACME_',
            validateInput: (val) => {
                if (!val || val.length < 2) return 'Enter at least 2 characters';
                if (/[^a-zA-Z0-9_-]/.test(val)) return 'Only letters, numbers, _ and - allowed';
                return null;
            }
        });
        if (!prefix) return;

        // Step 3: Name it
        const name = await vscode.window.showInputBox({
            prompt: 'Step 3/3: Give this pattern a name',
            placeHolder: `e.g., My ${secretType}`,
            value: `${prefix} ${secretType}`
        });
        if (!name) return;

        // Auto-generate regex from prefix
        const escapedPrefix = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = `${escapedPrefix}[a-zA-Z0-9_-]{8,}`;

        cfg.customPatterns.push({
            id: 'custom_' + Date.now(),
            name,
            regex,
            provider: 'Custom',
            type: secretType,
            enabled: true
        });

        await this.config.save({ customPatterns: cfg.customPatterns });
        vscode.window.showInformationMessage(`Pattern "${name}" created! SafeEnv will now detect secrets starting with "${prefix}"`);
        await this.postState();
    }

    private async handleDeletePattern(id: string) {
        const cfg = await this.config.load();
        cfg.customPatterns = cfg.customPatterns.filter(p => p.id !== id);
        await this.config.save({ customPatterns: cfg.customPatterns });
        await this.postState();
    }

    private async postState() {
        const plan = await this.license.getPlan();
        const cfg = await this.config.load();
        const proPatterns = this.license.getStoredPatterns();

        this.view?.webview.postMessage({
            command: 'state',
            data: {
                isPro: plan === 'PRO',
                blocked: this.getBlockedCount(),
                patterns: cfg.customPatterns,
                proPatterns: proPatterns.length,
                licenseKey: await this.license.getStoredKey()
            }
        });
    }

    private getHtml(webview: vscode.Webview): string {
        const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extUri, 'media', 'icon.png'));
        const nonce = this.getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; style-src 'unsafe-inline'; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeEnv Control Center</title>
    <style>
        :root {
            --accent: #3b82f6;
            --accent-glow: rgba(59, 130, 246, 0.4);
            --gold: #f59e0b;
            --gold-glow: rgba(245, 158, 11, 0.4);
            --red: #ef4444;
            --bg-card: rgba(255, 255, 255, 0.04);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--vscode-sideBar-background);
            color: var(--vscode-foreground);
            padding: 20px 16px;
            line-height: 1.4;
            overflow-x: hidden;
        }

        /* Hero Header */
        .hero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .icon-vault {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            animation: float 3s ease-in-out infinite;
            overflow: hidden;
        }

        .icon-vault img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        .brand-name {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(to right, #fff, #93c5fd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .badge {
            font-size: 10px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .badge-free { background: #3f3f46; color: #d4d4d8; }
        .badge-pro { 
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); 
            color: #000;
            box-shadow: 0 0 15px var(--gold-glow);
        }

        /* Stats Section */
        .stats-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 24px;
        }

        .stat-box {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 16px;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .stat-box:hover {
            border-color: rgba(255,255,255,0.2);
            transform: translateY(-2px);
            background: rgba(255,255,255,0.06);
        }

        .stat-box::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--red);
            opacity: 0.3;
        }

        .stat-box.blue::after { background: var(--accent); }

        .stat-val {
            font-size: 32px;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 6px;
            font-variant-numeric: tabular-nums;
        }

        .stat-val.red { color: #ef4444; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4)); }
        .stat-val.purple { color: #60a5fa; filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.4)); }

        .stat-lab {
            font-size: 10px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        /* Main Section */
        .section { margin-bottom: 28px; }
        .label {
            font-size: 12px;
            font-weight: 700;
            color: rgba(255,255,255,0.6);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Buttons */
        .btn {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s;
            margin-bottom: 10px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
            filter: brightness(1.1);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }

        .btn-outline {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
        }

        .btn-outline:hover:not(:disabled) {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.3);
        }

        .btn-outline:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-gold {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #000;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        /* Custom Tooltips */
        .tooltip-wrap {
            position: relative;
            width: 100%;
        }
        .tooltip {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 100%);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 11px;
            font-weight: 500;
            color: rgba(255,255,255,0.85);
            line-height: 1.4;
            white-space: normal;
            width: 220px;
            text-align: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            z-index: 100;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: #2d2d3d;
        }
        .tooltip-wrap:hover .tooltip {
            opacity: 1;
            visibility: visible;
        }

        /* Patterns List */
        .p-list { list-style: none; }
        .p-item {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 14px;
            padding: 12px 14px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: 0.2s;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .p-item:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); }

        .p-name { font-weight: 700; font-size: 13px; color: #f4f4f5; }
        .p-meta { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }

        .p-del {
            background: none;
            border: none;
            color: rgba(255,255,255,0.2);
            cursor: pointer;
            font-size: 18px;
            transition: 0.2s;
            padding: 4px;
        }
        .p-del:hover { color: #ef4444; transform: scale(1.2); }

        /* License Input */
        .input-group {
            display: flex;
            gap: 8px;
            background: rgba(0,0,0,0.2);
            padding: 4px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.08);
            margin-bottom: 12px;
        }

        .input-key {
            flex: 1;
            background: transparent;
            border: none;
            padding: 10px 12px;
            color: #fff;
            font-size: 13px;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        .input-key:focus { outline: none; }

        .btn-icon {
            background: rgba(255,255,255,0.05);
            border: none;
            color: #fff;
            padding: 8px 12px;
            border-radius: 10px;
            cursor: pointer;
        }
        .btn-icon:hover { background: rgba(255,255,255,0.12); }

        /* Pro Status Card */
        .pro-card {
            background: linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(234,88,12,0.05) 100%);
            border: 1px solid rgba(245,158,11,0.2);
            border-radius: 18px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
        }

        .pro-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%);
            animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .crown {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            z-index: 1;
        }

        .pro-text { z-index: 1; }
        .pro-head { font-weight: 800; font-size: 15px; color: #facc15; }
        .pro-sub { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; }

        /* Divider */
        .divider {
            display: flex;
            align-items: center;
            margin: 16px 0;
            color: rgba(255,255,255,0.3);
            font-size: 11px;
            font-weight: 600;
        }
        .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.1);
        }
        .divider span {
            padding: 0 12px;
            text-transform: uppercase;
        }

        /* Upgrade Hint */
        .upgrade-hint {
            text-align: center;
            font-size: 10px;
            color: rgba(255,255,255,0.3);
            margin-top: 8px;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 30px 20px;
            opacity: 0.6;
        }
        .empty-ghost {
            font-size: 48px;
            margin-bottom: 12px;
            filter: grayscale(0.5);
            opacity: 0.4;
        }
        .empty-title {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
            margin-bottom: 4px;
        }
        .empty-sub {
            font-size: 11px;
            color: rgba(255,255,255,0.3);
        }

        /* Skeleton Loading */
        .skeleton {
            background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
            height: 48px;
            margin-bottom: 10px;
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .skeleton-list { display: none; }
        .skeleton-list.active { display: block; }

        /* Collapsible Sections */
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 8px 0;
            margin-bottom: 8px;
            user-select: none;
        }
        .section-header:hover .label { color: rgba(255,255,255,0.8); }
        .section-toggle {
            font-size: 12px;
            color: rgba(255,255,255,0.3);
            transition: transform 0.2s;
        }
        .section-toggle.collapsed { transform: rotate(-90deg); }
        .section-content {
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease-out, opacity 0.2s;
            opacity: 1;
        }
        .section-content.collapsed {
            max-height: 0;
            opacity: 0;
        }
    </style>
</head>
<body>
    <div class="hero">
        <div class="brand">
            <div class="icon-vault">
                <img src="${logoUri}" alt="SafeEnv Logo">
            </div>
            <span class="brand-name">SafeEnv</span>
        </div>
        <span id="badge" class="badge badge-free">Free</span>
    </div>

    <div class="stats-container">
        <div class="stat-box">
            <div id="blockedCount" class="stat-val red">0</div>
            <div class="stat-lab">Leaks Intercepted</div>
        </div>
        <div class="stat-box blue">
            <div id="syncCount" class="stat-val purple">0</div>
            <div class="stat-lab">Cloud Patterns</div>
        </div>
    </div>

    <div class="section">
        <div class="section-header" data-section="patterns">
            <div class="label">🛡️ Shield Patterns</div>
            <span class="section-toggle">▼</span>
        </div>
        <div class="section-content" id="patternsSection">
            <ul id="pList" class="p-list"></ul>
            <div id="skeletonList" class="skeleton-list">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
            <div class="tooltip-wrap">
                <button id="addBtn" class="btn btn-primary">
                    <span>+</span> Add Custom Pattern
                </button>
                <div class="tooltip">Teach SafeEnv to recognize your own secrets. Enter a prefix (like 'my_api_') and we'll detect anything matching it.</div>
            </div>
            <div class="tooltip-wrap">
                <button id="syncBtn" class="btn btn-outline" disabled>
                    <span>☁️</span> Sync Latest Patterns 🔒
                </button>
                <div class="tooltip">Download the latest secret detection patterns from SafeEnv Cloud to catch new threats automatically.</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header" data-section="license">
            <div class="label">🔑 Premium Access</div>
            <span class="section-toggle">▼</span>
        </div>
        <div class="section-content" id="licenseSection">
        <div id="freeUI">
            <div class="input-group">
                <input id="keyIn" class="input-key" placeholder="Enter License Key" spellcheck="false" autocomplete="off">
                <button id="pasteBtn" class="btn-icon" title="Paste Key">📋</button>
            </div>
            <button id="activateBtn" class="btn btn-gold">Activate License Key</button>
            <div class="divider">
                <span>or</span>
            </div>
            <a id="upgradeLink" href="#" class="btn btn-primary" target="_blank">
                🚀 Get SafeEnv Pro
            </a>
            <p class="upgrade-hint">Unlimited patterns + cloud sync for $9.99/mo</p>
        </div>
        <div id="proUI" style="display:none;">
            <div class="pro-card">
                <div class="crown">👑</div>
                <div class="pro-text">
                    <div class="pro-head">SafeEnv Pro Active</div>
                    <div class="pro-sub">Maximum Protection Enabled</div>
                </div>
            </div>
            <button id="deactivateBtn" class="btn btn-outline" style="color:#ef4444; border-color:rgba(239,68,68,0.2)">
                Deactivate License
            </button>
        </div>
        </div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        const badge = document.getElementById('badge');
        const blocked = document.getElementById('blockedCount');
        const synced = document.getElementById('syncCount');
        const pList = document.getElementById('pList');
        const addBtn = document.getElementById('addBtn');
        const syncBtn = document.getElementById('syncBtn');
        const keyIn = document.getElementById('keyIn');
        const pasteBtn = document.getElementById('pasteBtn');
        const activateBtn = document.getElementById('activateBtn');
        const freeUI = document.getElementById('freeUI');
        const proUI = document.getElementById('proUI');
        const deactivateBtn = document.getElementById('deactivateBtn');

        addBtn.onclick = () => vscode.postMessage({ command: 'addPattern' });
        syncBtn.onclick = () => vscode.postMessage({ command: 'sync' });
        activateBtn.onclick = () => vscode.postMessage({ command: 'activate', key: keyIn.value });
        deactivateBtn.onclick = () => vscode.postMessage({ command: 'deactivate' });
        pasteBtn.onclick = () => vscode.postMessage({ command: 'paste' });

        window.addEventListener('message', e => {
            const { command, data, text } = e.data;
            
            if (command === 'pasted') {
                keyIn.value = text;
                return;
            }

            if (command !== 'state') return;

            blocked.textContent = data.blocked;
            synced.textContent = data.proPatterns;

            if (data.isPro) {
                badge.textContent = 'Pro';
                badge.className = 'badge badge-pro';
                freeUI.style.display = 'none';
                proUI.style.display = 'block';
                syncBtn.disabled = false;
                syncBtn.innerHTML = '<span>☁️</span> Sync Latest Patterns';
            } else {
                badge.textContent = 'Free';
                badge.className = 'badge badge-free';
                freeUI.style.display = 'block';
                proUI.style.display = 'none';
                syncBtn.disabled = true;
                syncBtn.innerHTML = '<span>☁️</span> Cloud Sync 🔒';
            }

            pList.innerHTML = '';
            if (data.patterns.length === 0) {
                pList.innerHTML = \`
                    <li class="empty-state">
                        <div class="empty-ghost">👻</div>
                        <div class="empty-title">All Clear!</div>
                        <div class="empty-sub">No custom shield patterns yet</div>
                    </li>\`;
            } else {
                data.patterns.forEach(p => {
                    const li = document.createElement('li');
                    li.className = 'p-item';
                    li.innerHTML = \`
                        <div>
                            <div class="p-name">\${p.name}</div>
                            <div class="p-meta">\${p.provider}</div>
                        </div>
                        <button class="p-del" data-id="\${p.id}">×</button>
                    \`;
                    pList.appendChild(li);
                });
            }

            pList.querySelectorAll('.p-del').forEach(btn => {
                btn.onclick = () => vscode.postMessage({ command: 'deletePattern', id: btn.dataset.id });
            });
        });

        // Collapsible sections
        document.querySelectorAll('.section-header').forEach(header => {
            header.onclick = () => {
                const section = header.dataset.section;
                const content = document.getElementById(section + 'Section');
                const toggle = header.querySelector('.section-toggle');
                content.classList.toggle('collapsed');
                toggle.classList.toggle('collapsed');
            };
        });

        // Skeleton loading for sync
        const skeletonList = document.getElementById('skeletonList');
        syncBtn.addEventListener('click', () => {
            pList.style.display = 'none';
            skeletonList.classList.add('active');
        });

        window.addEventListener('message', e => {
            if (e.data.command === 'state') {
                skeletonList.classList.remove('active');
                pList.style.display = 'block';
            }
        });

        vscode.postMessage({ command: 'refresh' });
    </script>
</body>
</html>`;
    }

    private getNonce(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
