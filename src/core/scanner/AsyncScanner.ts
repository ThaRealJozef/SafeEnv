import { IScanner } from './IScanner';
import { ScanResult } from '../types';

/**
 * Asynchronous scanner wrapper that yields to the event loop
 * to prevent blocking the UI thread during regex execution.
 */
export class AsyncScanner {
    private scanner: IScanner;

    constructor(scanner: IScanner) {
        this.scanner = scanner;
    }

    /**
     * Performs a non-blocking scan by yielding to the event loop.
     * For small payloads, this adds minimal overhead. For large payloads,
     * this prevents UI freezes.
     * 
     * @param text The text to scan for secrets
     * @returns Promise resolving to the scan result
     */
    public async scanAsync(text: string): Promise<ScanResult> {
        return new Promise((resolve) => {
            // Use setTimeout(0) to yield to the event loop
            setTimeout(() => {
                const result = this.scanner.scan(text);
                resolve(result);
            }, 0);
        });
    }
}
