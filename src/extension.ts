import * as vscode from 'vscode';
import { WasmScanner } from './core/scanner/WasmScanner';
import { AsyncScanner } from './core/scanner/AsyncScanner';
import { ClipboardSentinel } from './services/ClipboardSentinel';
import { GhostAlertDecorator } from './ui/GhostAlertDecorator';
import { Logger } from './utils/Logger';
import { VSCodeConfigService } from './services/VSCodeConfigService';
import { LicenseService } from './services/LicenseService';
import { SidebarProvider } from './ui/SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    Logger.info('Extension activated');

    const configService = new VSCodeConfigService();

    const scanner = new WasmScanner();
    scanner.initialize().then(() => {
        Logger.info('WASM scanner ready');
    });
    const asyncScanner = new AsyncScanner(scanner);

    const licenseService = new LicenseService(context);

    const sentinel = new ClipboardSentinel(asyncScanner, configService);
    const decorator = new GhostAlertDecorator(scanner);

    const sidebarProvider = new SidebarProvider(
        context,
        context.extensionUri,
        licenseService,
        configService
    );

    sentinel.activate(context);
    decorator.activate(context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            SidebarProvider.viewType,
            sidebarProvider
        )
    );

    const scanCommand = vscode.commands.registerCommand('safeenv.scanDocument', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            vscode.window.showInformationMessage('SafeEnv: Scanning document...');
        }
    });

    context.subscriptions.push(scanCommand);
}

export function deactivate() { }
