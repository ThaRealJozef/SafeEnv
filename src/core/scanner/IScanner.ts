import { ScanResult } from '../types';

export interface IScanner {
    scan(text: string): ScanResult;
}
