import * as vscode from 'vscode';

export type Plan = 'FREE' | 'PRO';

/**
 * Handles license storage and Pro plan detection.
 */
export class LicenseService {
    private static readonly KEY_ID = 'safeenv.licenseKey';
    private ctx: vscode.ExtensionContext;
    private plan: Plan = 'FREE';

    constructor(context: vscode.ExtensionContext) {
        this.ctx = context;
        this.init();
    }

    private async init(): Promise<void> {
        const key = await this.ctx.secrets.get(LicenseService.KEY_ID);
        if (key) this.plan = 'PRO';
    }

    // TODO: Replace with real API validation
    async verifyKey(key: string): Promise<boolean> {
        const valid = key === 'PRO-DEMO-KEY';
        if (valid) {
            await this.ctx.secrets.store(LicenseService.KEY_ID, key);
            this.plan = 'PRO';
        }
        return valid;
    }

    async getPlan(): Promise<Plan> {
        const key = await this.ctx.secrets.get(LicenseService.KEY_ID);
        if (key) this.plan = 'PRO';
        return this.plan;
    }

    getMaxPatterns(): number {
        return this.plan === 'PRO' ? Infinity : 1;
    }

    async clearLicense(): Promise<void> {
        await this.ctx.secrets.delete(LicenseService.KEY_ID);
        this.plan = 'FREE';
    }
}
