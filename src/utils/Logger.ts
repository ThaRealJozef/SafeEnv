const DEBUG = process.env.NODE_ENV !== 'production';

export class Logger {
    static info(message: string, ...args: unknown[]): void {
        if (DEBUG) {
            console.log(`[SafeEnv] ${message}`, ...args);
        }
    }

    static warn(message: string, ...args: unknown[]): void {
        if (DEBUG) {
            console.warn(`[SafeEnv] ${message}`, ...args);
        }
    }

    static error(message: string, ...args: unknown[]): void {
        // Always log errors
        console.error(`[SafeEnv] ${message}`, ...args);
    }
}
