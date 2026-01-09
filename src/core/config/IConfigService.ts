export interface UserPattern {
    id: string;
    name: string;
    regex: string;
    provider: string;
    type: string;
    enabled: boolean;
}

export interface SafeEnvConfig {
    enableScanning: boolean;
    customPatterns: UserPattern[];
    allowList: string[];
}

export interface IConfigService {
    load(): Promise<SafeEnvConfig>;
    save(config: Partial<SafeEnvConfig>): Promise<void>;
    onChange(callback: (config: SafeEnvConfig) => void): void;
}
