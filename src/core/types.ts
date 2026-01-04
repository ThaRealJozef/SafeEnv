/**
 * Represents a single detected secret within the scanned text.
 */
export interface SecretMatch {
  /** The provider (e.g., 'AWS', 'Stripe', 'OpenAI') */
  provider: string;
  /** The type of secret (e.g., 'Access Key ID', 'Secret Key') */
  type: string;
  /** The matched secret value */
  value: string;
  /** Start index of the match in the original text (0-indexed) */
  startIndex: number;
  /** End index of the match in the original text (0-indexed) */
  endIndex: number;
}

/**
 * The result of a scan operation.
 */
export interface ScanResult {
  /** True if no secrets were detected */
  isClean: boolean;
  /** Array of detected secrets */
  matches: SecretMatch[];
  /** Time taken for the scan in milliseconds */
  scanTimeMs: number;
}
