import * as vscode from 'vscode';
import { ScanResult } from '../core/types';

export async function showInterventionModal(result: ScanResult, _raw: string): Promise<'inject' | 'paste' | 'cancel'> {
    const count = result.matches.length;
    const providers = [...new Set(result.matches.map(m => m.provider))].join(', ');

    const msg = `${count} secret(s) detected (${providers}). Paste safely?`;

    const options: vscode.MessageItem[] = [
        { title: 'Save to .env', isCloseAffordance: false },
        { title: 'Paste Anyway', isCloseAffordance: false },
    ];

    const choice = await vscode.window.showWarningMessage(msg, { modal: true }, ...options);

    if (choice?.title === 'Save to .env') return 'inject';
    if (choice?.title === 'Paste Anyway') return 'paste';
    return 'cancel';
}
