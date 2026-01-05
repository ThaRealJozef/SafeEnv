import * as vscode from 'vscode';
import { WasmScanner } from './core/scanner/WasmScanner';
import { AsyncScanner } from './core/scanner/AsyncScanner';
import { ClipboardSentinel } from './services/ClipboardSentinel';
import { GhostAlertDecorator } from './ui/GhostAlertDecorator';
import { Logger } from './utils/Logger';
import { VSCodeConfigService } from './services/VSCodeConfigService';
import { LicenseService } from './services/LicenseService';
import { SidebarProvider } from './ui/SidebarProvider';

/**
 * This method is called when the extension is activated.
 * Activation depends on the events defined in package.json.
 */
export function activate(context: vscode.ExtensionContext) {
    Logger.info('Extension activated.');

    // 1. Initialize Configuration Service
    const configService = new VSCodeConfigService();

    // 2. Initialize Rust/WASM Scanner Engine
    const scanner = new WasmScanner();
    scanner.initialize().then(() => {
        Logger.info('SafeEnv: Rust/WASM Engine Active 🦀');
    });
    const asyncScanner = new AsyncScanner(scanner);

    // 3. Initialize License Service
    const licenseService = new LicenseService(context);

    // 4. Initialize UI & Service Layers
    const sentinel = new ClipboardSentinel(asyncScanner, configService);
    const decorator = new GhostAlertDecorator(scanner);

    // 5. Initialize Sidebar Provider
    const sidebarProvider = new SidebarProvider(
        context,
        context.extensionUri,
        licenseService,
        configService
    );

    // 6. Activate Components
    sentinel.activate(context);
    decorator.activate(context);

    // 7. Register Sidebar WebviewViewProvider
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            SidebarProvider.viewType,
            sidebarProvider
        )
    );

    // 8. Register Manual Scan Command
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
