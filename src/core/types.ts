export interface SecretMatch {
  provider: string;
  type: string;
  value: string;
  startIndex: number;
  endIndex: number;
}

export interface ScanResult {
  isClean: boolean;
  matches: SecretMatch[];
  scanTimeMs: number;
}
