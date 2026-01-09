import * as vscode from 'vscode';
import { IConfigService, SafeEnvConfig, UserPattern } from '../core/config/IConfigService';

/**
 * Reads/writes SafeEnv settings from VS Code workspace config.
 */
export class VSCodeConfigService implements IConfigService {
    private static readonly KEY = 'safeenv';
    private listeners: ((config: SafeEnvConfig) => void)[] = [];

    constructor() {
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(VSCodeConfigService.KEY)) {
                this.load().then(cfg => this.listeners.forEach(cb => cb(cfg)));
            }
        });
    }

    async load(): Promise<SafeEnvConfig> {
        const cfg = vscode.workspace.getConfiguration(VSCodeConfigService.KEY);
        return {
            enableScanning: cfg.get('enableScanning', true),
            customPatterns: cfg.get<UserPattern[]>('customPatterns', []),
            allowList: cfg.get<string[]>('allowList', []),
        };
    }

    async save(partial: Partial<SafeEnvConfig>): Promise<void> {
        const cfg = vscode.workspace.getConfiguration(VSCodeConfigService.KEY);
        const target = vscode.ConfigurationTarget.Global;

        if (partial.customPatterns !== undefined) {
            await cfg.update('customPatterns', partial.customPatterns, target);
        }
        if (partial.allowList !== undefined) {
            await cfg.update('allowList', partial.allowList, target);
        }
        if (partial.enableScanning !== undefined) {
            await cfg.update('enableScanning', partial.enableScanning, target);
        }
    }

    onChange(callback: (config: SafeEnvConfig) => void): void {
        this.listeners.push(callback);
    }
}
