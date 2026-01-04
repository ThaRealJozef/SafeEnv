/// <reference types="chrome"/>
import { IConfigService, SafeEnvConfig, UserPattern } from '../../../src/core/config/IConfigService';

/**
 * Chrome extension implementation of IConfigService.
 * Uses chrome.storage.sync to persist user configuration across devices.
 * Falls back to in-memory storage if chrome.storage is unavailable.
 */
export class ChromeConfigService implements IConfigService {
    private static readonly STORAGE_KEY = 'safeenv_config';
    private inMemoryConfig: SafeEnvConfig | null = null;
    private callbacks: ((config: SafeEnvConfig) => void)[] = [];

    constructor() {
        // Listen for storage changes if chrome.storage is available
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName === 'sync' && changes[ChromeConfigService.STORAGE_KEY]) {
                    const newConfig = changes[ChromeConfigService.STORAGE_KEY].newValue as SafeEnvConfig;
                    if (newConfig) {
                        this.callbacks.forEach((cb) => cb(newConfig));
                    }
                }
            });
        }
    }

    /**
     * Loads configuration from chrome.storage.sync or in-memory fallback.
     */
    public async load(): Promise<SafeEnvConfig> {
        // Use chrome.storage.sync if available
        if (typeof chrome !== 'undefined' && chrome.storage) {
            return new Promise((resolve) => {
                chrome.storage.sync.get(ChromeConfigService.STORAGE_KEY, (result) => {
                    const stored = result[ChromeConfigService.STORAGE_KEY] as SafeEnvConfig | undefined;
                    const config: SafeEnvConfig = stored ?? this.getDefaultConfig();
                    resolve(config);
                });
            });
        }

        // Fallback to in-memory config for local development
        if (!this.inMemoryConfig) {
            this.inMemoryConfig = this.getDefaultConfig();
        }
        return Promise.resolve(this.inMemoryConfig);
    }

    /**
     * Saves configuration to chrome.storage.sync or in-memory fallback.
     */
    public async save(partialConfig: Partial<SafeEnvConfig>): Promise<void> {
        const currentConfig = await this.load();
        const updatedConfig: SafeEnvConfig = {
            ...currentConfig,
            ...partialConfig,
        };

        // Use chrome.storage.sync if available
        if (typeof chrome !== 'undefined' && chrome.storage) {
            return new Promise((resolve) => {
                chrome.storage.sync.set(
                    { [ChromeConfigService.STORAGE_KEY]: updatedConfig },
                    () => resolve()
                );
            });
        }

        // Fallback to in-memory storage
        this.inMemoryConfig = updatedConfig;
        return Promise.resolve();
    }

    /**
     * Subscribes to configuration changes.
     */
    public onChange(callback: (config: SafeEnvConfig) => void): void {
        this.callbacks.push(callback);
    }

    /**
     * Returns default configuration.
     */
    private getDefaultConfig(): SafeEnvConfig {
        return {
            enableScanning: true,
            customPatterns: [],
            allowList: [],
        };
    }
}
