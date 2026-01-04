import * as vscode from 'vscode';
import { ScanResult } from '../core/types';

/**
 * Shows an intervention modal when a secret is detected in the clipboard.
 * Provides options to safely handle the secret.
 */
export async function showInterventionModal(result: ScanResult, rawText: string): Promise<'inject' | 'paste' | 'cancel'> {
    const secretCount = result.matches.length;
    const providerList = [...new Set(result.matches.map(m => m.provider))].join(', ');

    const message = `⚠️ GhostVault: ${secretCount} secret(s) detected (${providerList}). Accidental exposure can be costly!`;

    const options: vscode.MessageItem[] = [
        { title: 'Inject as Environment Variable', isCloseAffordance: false },
        { title: 'Paste Anyway (Unsafe)', isCloseAffordance: false },
    ];

    const choice = await vscode.window.showWarningMessage(message, { modal: true }, ...options);

    if (choice?.title === 'Inject as Environment Variable') {
        return 'inject';
    } else if (choice?.title === 'Paste Anyway (Unsafe)') {
        return 'paste';
    }

    return 'cancel';
}
