import { IScanner } from './IScanner';
import { ScanResult } from '../types';

/**
 * Wraps a scanner to run non-blocking via setTimeout.
 */
export class AsyncScanner {
    private scanner: IScanner;

    constructor(scanner: IScanner) {
        this.scanner = scanner;
    }

    async scanAsync(text: string): Promise<ScanResult> {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.scanner.scan(text)), 0);
        });
    }
}
