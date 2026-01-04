/**
 * User-defined regex pattern for secret detection.
 */
export interface UserPattern {
    id: string;
    name: string;
    regex: string;
    provider: string;
    type: string;
    enabled: boolean;
}

/**
 * Complete configuration for SafeEnv.
 */
export interface SafeEnvConfig {
    enableScanning: boolean;
    customPatterns: UserPattern[];
    allowList: string[]; // Literal strings to ignore
}

/**
 * Abstract interface for platform-specific configuration storage.
 * VS Code implementation uses workspace settings.
 * Chrome implementation uses chrome.storage.sync.
 */
export interface IConfigService {
    /**
     * Loads the current configuration.
     * Returns merged result of defaults + user overrides.
     */
    load(): Promise<SafeEnvConfig>;

    /**
     * Saves user-defined configuration.
     */
    save(config: Partial<SafeEnvConfig>): Promise<void>;

    /**
     * Subscribes to configuration changes.
     */
    onChange(callback: (config: SafeEnvConfig) => void): void;
}
