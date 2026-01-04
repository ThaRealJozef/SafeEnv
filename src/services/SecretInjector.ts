import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service to handle injecting secrets into .env files and updating .gitignore.
 */
export class SecretInjector {
    /**
     * Injects a secret into the .env file in the workspace root.
     * Ensures .env is added to .gitignore.
     */
    public async inject(variableName: string, value: string): Promise<boolean> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('GhostVault: No workspace folder found to inject .env variable.');
            return false;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const envPath = path.join(rootPath, '.env');
        const gitignorePath = path.join(rootPath, '.gitignore');

        try {
            // 1. Append to .env
            const envLine = `\n${variableName}=${value}\n`;
            fs.appendFileSync(envPath, envLine, 'utf8');

            // 2. Ensure .env is in .gitignore
            this.ensureInGitignore(gitignorePath, '.env');

            return true;
        } catch (error) {
            vscode.window.showErrorMessage(`GhostVault: Failed to inject secret: ${error}`);
            return false;
        }
    }

    private ensureInGitignore(gitignorePath: string, fileName: string): void {
        let content = '';
        if (fs.existsSync(gitignorePath)) {
            content = fs.readFileSync(gitignorePath, 'utf8');
        }

        const lines = content.split('\n');
        if (!lines.includes(fileName)) {
            const separator = content.endsWith('\n') ? '' : '\n';
            fs.appendFileSync(gitignorePath, `${separator}${fileName}\n`, 'utf8');
        }
    }
}
