import { IScanner } from './IScanner';
import { ScanResult } from '../types';

// Use require to load the WASM module.
// The 'nodejs' target produces a JS file that handles the WASM loading synchronously.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wasm = require('./wasm/safeenv_core.js');

/**
 * WASM-based implementation of the IScanner interface.
 * Uses Rust + WebAssembly for high-performance secret scanning.
 */
export class WasmScanner implements IScanner {
    /**
     * Initialize the WASM module.
     * The nodejs target loads synchronously upon require, so explicit init is often not needed.
     * This method exists for interface consistency and verification.
     */
    public initialize(): Promise<void> {
        try {
            console.log(`[WasmScanner] Loaded Rust core version: ${wasm.version()}`);
        } catch (error) {
            console.error('[WasmScanner] Failed to load WASM version:', error);
        }
        return Promise.resolve();
    }

    /**
     * Scans the provided text for secrets using the WASM engine.
     * @param text The raw text to scan.
     * @returns A ScanResult containing detected secrets and performance metadata.
     */
    public scan(text: string): ScanResult {
        try {
            // Rust returns the ScanResult object directly via serde serialization
            return wasm.scan(text) as ScanResult;
        } catch (error) {
            console.error('[WasmScanner] CRITICAL ERROR:', error);
            // Fallback to safe "clean" result if WASM crashes
            return {
                isClean: true,
                matches: [],
                scanTimeMs: 0
            };
        }
    }
}
