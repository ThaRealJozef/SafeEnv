import * as vscode from 'vscode';
import { IScanner } from '../core/scanner/IScanner';

/**
 * Handles visual indicators (decorations) for secrets found in the editor.
 */
export class GhostAlertDecorator {
    private scanner: IScanner;
    private decorationType: vscode.TextEditorDecorationType;
    private timeout: NodeJS.Timeout | undefined;

    constructor(scanner: IScanner) {
        this.scanner = scanner;

        // Define the visual style for secrets
        this.decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            border: '1px solid rgba(255, 0, 0, 0.5)',
            borderRadius: '2px',
            gutterIconPath: vscode.Uri.parse(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="red" d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L8 1z"/></svg>`),
            gutterIconSize: 'contain',
            overviewRulerColor: 'red',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            after: {
                contentText: ' ⚠️ Secret Detected',
                color: 'rgba(255, 0, 0, 0.7)',
                margin: '0 0 0 1em',
                fontStyle: 'italic'
            }
        });
    }

    /**
     * Activates the decorator by listening to editor changes.
     */
    public activate(context: vscode.ExtensionContext): void {
        // Initial trigger
        if (vscode.window.activeTextEditor) {
            this.triggerUpdateDecorations(vscode.window.activeTextEditor);
        }

        // Listen for active editor changes
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.triggerUpdateDecorations(editor);
            }
        }));

        // Listen for document changes (with debounce)
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
            if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
                this.triggerUpdateDecorations(vscode.window.activeTextEditor);
            }
        }));
    }

    private triggerUpdateDecorations(editor: vscode.TextEditor): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.updateDecorations(editor), 500);
    }

    private updateDecorations(editor: vscode.TextEditor): void {
        const text = editor.document.getText();
        const result = this.scanner.scan(text);

        const decorations: vscode.DecorationOptions[] = result.matches.map(match => {
            const startPos = editor.document.positionAt(match.startIndex);
            const endPos = editor.document.positionAt(match.endIndex);
            const range = new vscode.Range(startPos, endPos);

            return {
                range,
                hoverMessage: `**GhostVault: ${match.provider} ${match.type} detected**\n\nAccidental exposure could compromise your security. Consider using an environment variable.`
            };
        });

        editor.setDecorations(this.decorationType, decorations);
    }

    public dispose(): void {
        this.decorationType.dispose();
    }
}
