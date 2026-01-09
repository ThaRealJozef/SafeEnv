import * as vscode from 'vscode';
import { AsyncScanner } from '../core/scanner/AsyncScanner';
import { IConfigService } from '../core/config/IConfigService';
import { ScanResult } from '../core/types';
import { showInterventionModal } from '../ui/InterventionModal';
import { SecretInjector } from './SecretInjector';

/**
 * Intercepts paste events and scans clipboard content for secrets.
 */
export class ClipboardSentinel {
    private asyncScanner: AsyncScanner;
    private configService: IConfigService;
    private injector: SecretInjector;
    private disposables: vscode.Disposable[] = [];
    private context?: vscode.ExtensionContext;

    constructor(asyncScanner: AsyncScanner, configService: IConfigService) {
        this.asyncScanner = asyncScanner;
        this.configService = configService;
        this.injector = new SecretInjector();
    }

    activate(ctx: vscode.ExtensionContext): void {
        this.context = ctx;
        const pasteOverride = vscode.commands.registerCommand(
            'editor.action.clipboardPasteAction',
            this.handlePaste.bind(this)
        );
        this.disposables.push(pasteOverride);
        ctx.subscriptions.push(...this.disposables);
    }

    private async handlePaste(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const clipboardText = await vscode.env.clipboard.readText();
        if (!clipboardText) return;

        const config = await this.configService.load();
        if (!config.enableScanning) {
            await this.paste(editor, clipboardText);
            return;
        }

        const result = await this.asyncScanner.scanAsync(clipboardText);
        const filteredMatches = result.matches.filter(
            m => !config.allowList.includes(m.value)
        );

        const filtered: ScanResult = {
            ...result,
            matches: filteredMatches,
            isClean: filteredMatches.length === 0,
        };

        if (filtered.isClean) {
            await this.paste(editor, clipboardText);
        } else {
            this.incrementBlockedCount();
            const choice = await showInterventionModal(filtered, clipboardText);

            if (choice === 'paste') {
                await this.paste(editor, clipboardText);
            } else if (choice === 'inject') {
                await this.handleInjection(editor, filtered);
            }
        }
    }

    private incrementBlockedCount(): void {
        const key = 'safeenv.secretsBlocked';
        const current = this.context?.globalState.get<number>(key) || 0;
        this.context?.globalState.update(key, current + 1);
    }

    private async handleInjection(editor: vscode.TextEditor, result: ScanResult): Promise<void> {
        const match = result.matches[0];
        const defaultName = `${match.provider.toUpperCase()}_API_KEY`;

        const varName = await vscode.window.showInputBox({
            prompt: `Enter variable name for ${match.provider} secret`,
            value: defaultName
        });

        if (varName) {
            const ok = await this.injector.inject(varName, match.value);
            if (ok) {
                await editor.edit(b => b.replace(editor.selection, `process.env.${varName}`));
                vscode.window.showInformationMessage(`Secret saved to .env as ${varName}`);
            }
        }
    }

    private async paste(editor: vscode.TextEditor, text: string): Promise<void> {
        await editor.edit(b => b.replace(editor.selection, text));
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
    }
}
