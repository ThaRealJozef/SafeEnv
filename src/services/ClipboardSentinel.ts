import * as vscode from 'vscode';
import { AsyncScanner } from '../core/scanner/AsyncScanner';
import { IConfigService } from '../core/config/IConfigService';
import { ScanResult } from '../core/types';
import { showInterventionModal } from '../ui/InterventionModal';
import { SecretInjector } from './SecretInjector';

export class ClipboardSentinel {
    private asyncScanner: AsyncScanner;
    private configService: IConfigService;
    private injector: SecretInjector;
    private disposables: vscode.Disposable[] = [];
    private extensionContext?: vscode.ExtensionContext;

    constructor(asyncScanner: AsyncScanner, configService: IConfigService) {
        this.asyncScanner = asyncScanner;
        this.configService = configService;
        this.injector = new SecretInjector();
    }

    /**
     * Activates the Clipboard Sentinel by overriding the paste command.
     */
    public activate(context: vscode.ExtensionContext): void {
        this.extensionContext = context;
        const pasteOverride = vscode.commands.registerCommand(
            'editor.action.clipboardPasteAction',
            this.handlePaste.bind(this)
        );
        this.disposables.push(pasteOverride);
        context.subscriptions.push(...this.disposables);
    }

    private async handlePaste(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        // 1. Read Clipboard
        const clipboardText = await vscode.env.clipboard.readText();
        if (!clipboardText) {
            return;
        }

        // 2. Load Configuration
        const config = await this.configService.load();

        // 3. Check if scanning is enabled
        if (!config.enableScanning) {
            await this.performManualPaste(editor, clipboardText);
            return;
        }

        // 4. Scan (Async)
        const result: ScanResult = await this.asyncScanner.scanAsync(clipboardText);

        // 5. Apply Allow-List Filter
        const filteredMatches = result.matches.filter(
            (match) => !config.allowList.includes(match.value)
        );

        const filteredResult: ScanResult = {
            ...result,
            matches: filteredMatches,
            isClean: filteredMatches.length === 0,
        };

        // 6. Decide
        if (filteredResult.isClean) {
            // CLEAN: Manually insert the text
            await this.performManualPaste(editor, clipboardText);
        } else {
            // INFECTED: Show intervention modal
            this.incrementSecretsBlockedCount();
            const choice = await showInterventionModal(filteredResult, clipboardText);

            if (choice === 'paste') {
                await this.performManualPaste(editor, clipboardText);
            } else if (choice === 'inject') {
                await this.handleInjection(editor, filteredResult, clipboardText);
            }
        }
    }

    private incrementSecretsBlockedCount(): void {
        const key = 'safeenv.secretsBlocked';
        const current = this.extensionContext?.globalState.get<number>(key) || 0;
        this.extensionContext?.globalState.update(key, current + 1);
    }


    private async handleInjection(editor: vscode.TextEditor, result: ScanResult, rawText: string): Promise<void> {
        const firstMatch = result.matches[0];
        const defaultVarName = `${firstMatch.provider.toUpperCase()}_API_KEY`;

        const varName = await vscode.window.showInputBox({
            prompt: `Enter environment variable name for ${firstMatch.provider} secret`,
            value: defaultVarName
        });

        if (varName) {
            const success = await this.injector.inject(varName, firstMatch.value);
            if (success) {
                const injectionSnippet = `process.env.${varName}`;
                await editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, injectionSnippet);
                });
                vscode.window.showInformationMessage(`GhostVault: Secret injected as ${varName} and added to .env`);
            }
        }
    }

    /**
     * Manually inserts text into the active editor, replacing the selection.
     * This bypasses the native 'paste' command to avoid recursion or 'command not found' errors.
     */
    public async performManualPaste(editor: vscode.TextEditor, text: string): Promise<void> {
        await editor.edit(editBuilder => {
            // Replace the current selection (or insertion point) with the text
            editBuilder.replace(editor.selection, text);
        });
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }
}
