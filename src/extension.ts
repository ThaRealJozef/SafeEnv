import * as vscode from 'vscode';
import { RegexScanner } from './core/scanner/RegexScanner';
import { ClipboardSentinel } from './services/ClipboardSentinel';
import { GhostAlertDecorator } from './ui/GhostAlertDecorator';
import { Logger } from './utils/Logger';

/**
 * This method is called when the extension is activated.
 * Activation depends on the events defined in package.json.
 */
export function activate(context: vscode.ExtensionContext) {
    Logger.info('Extension activated.');

    // 1. Initialize Core Logic
    const scanner = new RegexScanner();

    // 2. Initialize UI & Service Layers
    const sentinel = new ClipboardSentinel(scanner);
    const decorator = new GhostAlertDecorator(scanner);

    // 3. Activate Components
    sentinel.activate(context);
    decorator.activate(context);

    // 4. Register Manual Scan Command
    const scanCommand = vscode.commands.registerCommand('safeenv.scanDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.window.showInformationMessage('SafeEnv: Scanning document...');
            // Decorator will automatically update via onDidChangeTextDocument listener
            // but we could explicitly trigger it if needed.
        }
    });

    context.subscriptions.push(scanCommand);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() { }
