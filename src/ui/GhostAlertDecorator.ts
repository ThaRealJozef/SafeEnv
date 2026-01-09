import * as vscode from 'vscode';
import { IScanner } from '../core/scanner/IScanner';

/**
 * Adds visual decorations (red highlights) to detected secrets.
 */
export class GhostAlertDecorator {
    private scanner: IScanner;
    private decoration: vscode.TextEditorDecorationType;
    private debounce?: NodeJS.Timeout;

    constructor(scanner: IScanner) {
        this.scanner = scanner;
        this.decoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            border: '1px solid rgba(255, 0, 0, 0.5)',
            borderRadius: '2px',
            gutterIconPath: vscode.Uri.parse(
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="red" d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L8 1z"/></svg>`
            ),
            gutterIconSize: 'contain',
            overviewRulerColor: 'red',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            after: {
                contentText: ' ⚠ Secret',
                color: 'rgba(255, 0, 0, 0.7)',
                margin: '0 0 0 1em',
                fontStyle: 'italic'
            }
        });
    }

    activate(ctx: vscode.ExtensionContext): void {
        if (vscode.window.activeTextEditor) {
            this.scheduleUpdate(vscode.window.activeTextEditor);
        }

        ctx.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(e => e && this.scheduleUpdate(e))
        );

        ctx.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(e => {
                const editor = vscode.window.activeTextEditor;
                if (editor && e.document === editor.document) {
                    this.scheduleUpdate(editor);
                }
            })
        );
    }

    private scheduleUpdate(editor: vscode.TextEditor): void {
        if (this.debounce) clearTimeout(this.debounce);
        this.debounce = setTimeout(() => this.update(editor), 500);
    }

    private update(editor: vscode.TextEditor): void {
        const result = this.scanner.scan(editor.document.getText());

        const decorations = result.matches.map(m => {
            const start = editor.document.positionAt(m.startIndex);
            const end = editor.document.positionAt(m.endIndex);
            return {
                range: new vscode.Range(start, end),
                hoverMessage: `**${m.provider} ${m.type}** detected. Use an environment variable.`
            };
        });

        editor.setDecorations(this.decoration, decorations);
    }

    dispose(): void {
        this.decoration.dispose();
    }
}
