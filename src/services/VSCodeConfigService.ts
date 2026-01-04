import * as vscode from 'vscode';
import { IConfigService, SafeEnvConfig, UserPattern } from '../core/config/IConfigService';

/**
 * VS Code implementation of IConfigService.
 * Uses workspace settings to store user-defined patterns and allow-lists.
 */
export class VSCodeConfigService implements IConfigService {
    private static readonly CONFIG_KEY = 'safeenv';
    private callbacks: ((config: SafeEnvConfig) => void)[] = [];

    constructor() {
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(VSCodeConfigService.CONFIG_KEY)) {
                this.load().then((config) => {
                    this.callbacks.forEach((cb) => cb(config));
                });
            }
        });
    }

    /**
     * Loads configuration from VS Code workspace settings.
     */
    public async load(): Promise<SafeEnvConfig> {
        const config = vscode.workspace.getConfiguration(VSCodeConfigService.CONFIG_KEY);

        const customPatterns: UserPattern[] = config.get('customPatterns', []);
        const allowList: string[] = config.get('allowList', []);
        const enableScanning: boolean = config.get('enableScanning', true);

        return {
            enableScanning,
            customPatterns,
            allowList,
        };
    }

    /**
     * Saves configuration to VS Code workspace settings.
     */
    public async save(partialConfig: Partial<SafeEnvConfig>): Promise<void> {
        const config = vscode.workspace.getConfiguration(VSCodeConfigService.CONFIG_KEY);

        if (partialConfig.customPatterns !== undefined) {
            await config.update('customPatterns', partialConfig.customPatterns, vscode.ConfigurationTarget.Global);
        }

        if (partialConfig.allowList !== undefined) {
            await config.update('allowList', partialConfig.allowList, vscode.ConfigurationTarget.Global);
        }

        if (partialConfig.enableScanning !== undefined) {
            await config.update('enableScanning', partialConfig.enableScanning, vscode.ConfigurationTarget.Global);
        }
    }

    /**
     * Subscribes to configuration changes.
     */
    public onChange(callback: (config: SafeEnvConfig) => void): void {
        this.callbacks.push(callback);
    }
}
