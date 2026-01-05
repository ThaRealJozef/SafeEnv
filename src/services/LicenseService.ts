import * as vscode from 'vscode';

export type Plan = 'FREE' | 'PRO';

/**
 * Manages license key storage and plan detection.
 * Uses VS Code's SecretStorage API for secure credential storage.
 */
export class LicenseService {
    private static readonly LICENSE_KEY_ID = 'safeenv.licenseKey';
    private context: vscode.ExtensionContext;
    private cachedPlan: Plan = 'FREE';

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        // Initialize cached plan on construction
        this.initializePlan();
    }

    private async initializePlan(): Promise<void> {
        const storedKey = await this.context.secrets.get(LicenseService.LICENSE_KEY_ID);
        if (storedKey) {
            this.cachedPlan = 'PRO';
        }
    }

    /**
     * Verifies a license key.
     * MOCK: Returns true if key === 'PRO-DEMO-KEY'.
     * PROD: Replace with Lemon Squeezy /v1/licenses/activate endpoint.
     */
    public async verifyKey(key: string): Promise<boolean> {
        // --- MOCK LOGIC (Replace with API call in production) ---
        const isValid = key === 'PRO-DEMO-KEY';

        if (isValid) {
            await this.context.secrets.store(LicenseService.LICENSE_KEY_ID, key);
            this.cachedPlan = 'PRO';
        }
        return isValid;
    }

    /**
     * Returns the current plan based on stored key.
     */
    public async getPlan(): Promise<Plan> {
        const storedKey = await this.context.secrets.get(LicenseService.LICENSE_KEY_ID);
        if (storedKey) {
            // Re-validate on load (or trust cache for speed)
            this.cachedPlan = 'PRO';
        }
        return this.cachedPlan;
    }

    /**
     * Returns the max allowed custom patterns.
     */
    public getMaxPatterns(): number {
        return this.cachedPlan === 'PRO' ? Infinity : 1;
    }

    /**
     * Clears the stored license key (for debugging/logout).
     */
    public async clearLicense(): Promise<void> {
        await this.context.secrets.delete(LicenseService.LICENSE_KEY_ID);
        this.cachedPlan = 'FREE';
    }
}
