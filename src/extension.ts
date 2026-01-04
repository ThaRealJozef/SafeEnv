import * as vscode from 'vscode';
import { RegexScanner } from './core/scanner/RegexScanner';
import { AsyncScanner } from './core/scanner/AsyncScanner';
import { ClipboardSentinel } from './services/ClipboardSentinel';
import { GhostAlertDecorator } from './ui/GhostAlertDecorator';
import { Logger } from './utils/Logger';
import { VSCodeConfigService } from './services/VSCodeConfigService';

/**
 * This method is called when the extension is activated.
 * Activation depends on the events defined in package.json.
 */
export function activate(context: vscode.ExtensionContext) {
    Logger.info('Extension activated.');

    // 1. Initialize Configuration Service
    const configService = new VSCodeConfigService();

    // 2. Initialize Core Logic
    const scanner = new RegexScanner();
    const asyncScanner = new AsyncScanner(scanner);

    // 3. Initialize UI & Service Layers
    const sentinel = new ClipboardSentinel(asyncScanner, configService);
    const decorator = new GhostAlertDecorator(scanner);

    // 4. Activate Components
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
