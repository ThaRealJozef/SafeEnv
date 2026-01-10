import * as vscode from 'vscode';

export type Plan = 'FREE' | 'PRO';

const API_BASE = 'https://safe-env-rho.vercel.app/api';

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
        if (key) {
            const valid = await this.validateRemote(key);
            this.plan = valid ? 'PRO' : 'FREE';
        }
    }

    private async validateRemote(key: string): Promise<boolean> {
        try {
            const resp = await fetch(`${API_BASE}/validate`, {
                headers: { 'x-api-key': key }
            });
            if (!resp.ok) return false;
            const data = await resp.json();
            return data.valid === true;
        } catch {
            return false;
        }
    }

    async verifyKey(key: string): Promise<boolean> {
        const valid = await this.validateRemote(key);
        if (valid) {
            await this.ctx.secrets.store(LicenseService.KEY_ID, key);
            this.plan = 'PRO';
        }
        return valid;
    }

    async syncPatterns(): Promise<{ provider: string; type: string; regex: string }[]> {
        const key = await this.ctx.secrets.get(LicenseService.KEY_ID);
        if (!key) throw new Error('No license key');

        const resp = await fetch(`${API_BASE}/patterns`, {
            headers: { 'x-api-key': key }
        });

        if (!resp.ok) {
            if (resp.status === 429) throw new Error('Rate limit exceeded');
            throw new Error('Sync failed');
        }

        const data = await resp.json();
        await this.ctx.globalState.update('proPatterns', data.patterns);
        return data.patterns;
    }

    getStoredPatterns(): { provider: string; type: string; regex: string }[] {
        return this.ctx.globalState.get('proPatterns', []);
    }

    async getPlan(): Promise<Plan> {
        const key = await this.ctx.secrets.get(LicenseService.KEY_ID);
        if (key) {
            const valid = await this.validateRemote(key);
            this.plan = valid ? 'PRO' : 'FREE';
        }
        return this.plan;
    }

    async getStoredKey(): Promise<string | undefined> {
        return this.ctx.secrets.get(LicenseService.KEY_ID);
    }

    async clearLicense(): Promise<void> {
        await this.ctx.secrets.delete(LicenseService.KEY_ID);
        await this.ctx.globalState.update('proPatterns', undefined);
        this.plan = 'FREE';
    }
}
