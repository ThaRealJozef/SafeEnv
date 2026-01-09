import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Writes secrets to .env and updates .gitignore.
 */
export class SecretInjector {
    async inject(name: string, value: string): Promise<boolean> {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders?.length) {
            vscode.window.showErrorMessage('No workspace folder found');
            return false;
        }

        const root = folders[0].uri.fsPath;
        const envPath = path.join(root, '.env');
        const gitignore = path.join(root, '.gitignore');

        try {
            fs.appendFileSync(envPath, `\n${name}=${value}\n`, 'utf8');
            this.addToGitignore(gitignore, '.env');
            return true;
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to write .env: ${err}`);
            return false;
        }
    }

    private addToGitignore(filepath: string, entry: string): void {
        let content = '';
        if (fs.existsSync(filepath)) {
            content = fs.readFileSync(filepath, 'utf8');
        }

        if (!content.split('\n').includes(entry)) {
            const sep = content.endsWith('\n') ? '' : '\n';
            fs.appendFileSync(filepath, `${sep}${entry}\n`, 'utf8');
        }
    }
}
