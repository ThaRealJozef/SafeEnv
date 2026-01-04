import { ScanResult } from '../types';

/**
 * Scanner Interface.
 * This abstraction allows swapping implementations (e.g., from Regex to Rust/WASM)
 * without affecting the rest of the system.
 */
export interface IScanner {
    /**
     * Scans the provided text for secrets.
     * @param text The raw text to scan.
     * @returns A ScanResult object containing any detected matches.
     */
    scan(text: string): ScanResult;
}
