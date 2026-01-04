import { RegexScanner } from '../../../src/core/scanner/RegexScanner';
import { showShadowAlert } from './shadow_ui';

const scanner = new RegexScanner();

/**
 * Initializes the paste interceptor in the capture phase.
 */
function initSafeEnv(): void {
    window.addEventListener('paste', (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return;

        const text = clipboardData.getData('text/plain');
        if (!text) return;

        const result = scanner.scan(text);

        if (!result.isClean) {
            // 1. Stop propagation to prevent site scripts from seeing the secret
            event.stopImmediatePropagation();

            // 2. Prevent default behavior
            event.preventDefault();

            // 3. Trigger Shield UI
            showShadowAlert(result, text);
        }
    }, true); // Use Capture Phase
}

// Start the observer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafeEnv);
} else {
    initSafeEnv();
}
