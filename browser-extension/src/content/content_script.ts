import { RegexScanner } from '../../../src/core/scanner/RegexScanner';
import { AsyncScanner } from '../../../src/core/scanner/AsyncScanner';
import { ChromeConfigService } from '../services/ChromeConfigService';
import { showShadowAlert, showScanningState, hideScanningState } from './shadow_ui';

const scanner = new RegexScanner();
const asyncScanner = new AsyncScanner(scanner);
const configService = new ChromeConfigService();

/**
 * Initializes the paste interceptor with Block-First pattern.
 */
function initSafeEnv(): void {
    window.addEventListener('paste', async (event: ClipboardEvent) => {
        // STEP 1: Always block the paste immediately (synchronous)
        event.preventDefault();
        event.stopImmediatePropagation();

        // STEP 2: Show scanning indicator
        showScanningState();

        try {
            // STEP 3: Read clipboard (async)
            const text = await navigator.clipboard.readText();
            if (!text) {
                hideScanningState();
                return;
            }

            // STEP 4: Load configuration
            const config = await configService.load();

            // Check if scanning is enabled
            if (!config.enableScanning) {
                hideScanningState();
                insertText(text);
                return;
            }

            // STEP 5: Scan asynchronously
            const result = await asyncScanner.scanAsync(text);

            // STEP 6: Apply allow-list filter
            const filteredMatches = result.matches.filter(
                (match) => !config.allowList.includes(match.value)
            );

            const filteredResult = {
                ...result,
                matches: filteredMatches,
                isClean: filteredMatches.length === 0,
            };

            // STEP 7: Hide scanning indicator
            hideScanningState();

            // STEP 8: Decide action based on scan result
            if (filteredResult.isClean) {
                // Clean: Insert text programmatically
                insertText(text);
            } else {
                // Dirty: Show alert modal
                showShadowAlert(filteredResult, text);
            }
        } catch (error) {
            // If anything fails, hide indicator and allow paste
            hideScanningState();
            console.error('[SafeEnv] Scan failed:', error);
        }
    }, true); // Use Capture Phase
}

/**
 * Programmatically inserts text at the cursor position.
 * Uses document.execCommand as a fallback for complex editors.
 */
function insertText(text: string): void {
    // Try to use execCommand for better compatibility with rich text editors
    if (document.execCommand) {
        document.execCommand('insertText', false, text);
    } else {
        // Fallback for contenteditable elements
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    }
}

// Start the interceptor
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafeEnv);
} else {
    initSafeEnv();
}
