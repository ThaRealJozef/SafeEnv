import { IScanner } from './IScanner';
import { ScanResult } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const wasm = require('./wasm/safeenv_core.js');

/**
 * WASM scanner using Rust-compiled WebAssembly.
 */
export class WasmScanner implements IScanner {
    initialize(): Promise<void> {
        try {
            console.log(`SafeEnv v${wasm.version()} ready`);
        } catch (err) {
            console.error('WASM load failed:', err);
        }
        return Promise.resolve();
    }

    scan(text: string): ScanResult {
        try {
            return wasm.scan(text) as ScanResult;
        } catch (err) {
            console.error('Scan error:', err);
            return { isClean: true, matches: [], scanTimeMs: 0 };
        }
    }
}
