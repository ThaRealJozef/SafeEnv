import { IScanner } from './IScanner';
import { ScanResult, SecretMatch } from '../types';
import { BIG_THREE_PATTERNS } from './patterns';

/**
 * Regex-based implementation of the IScanner interface.
 * Scans text sequentially against the Big Three patterns.
 */
export class RegexScanner implements IScanner {
    /**
     * Scans the provided text for secrets using the Big Three patterns.
     * @param text The raw text to scan.
     * @returns A ScanResult containing detected secrets and performance metadata.
     */
    public scan(text: string): ScanResult {
        const startTime = Date.now();
        const matches: SecretMatch[] = [];

        if (!text) {
            return {
                isClean: true,
                matches: [],
                scanTimeMs: Date.now() - startTime,
            };
        }

        for (const pattern of BIG_THREE_PATTERNS) {
            // Reset lastIndex for safety, though we create a new exec loop
            pattern.regex.lastIndex = 0;

            let match;
            while ((match = pattern.regex.exec(text)) !== null) {
                matches.push({
                    provider: pattern.provider,
                    type: pattern.type,
                    value: match[0],
                    startIndex: match.index,
                    endIndex: match.index + match[0].length,
                });
            }
        }

        // Sort matches by start index to ensure sequential highlighting in UI
        matches.sort((a, b) => a.startIndex - b.startIndex);

        return {
            isClean: matches.length === 0,
            matches,
            scanTimeMs: Date.now() - startTime,
        };
    }
}
