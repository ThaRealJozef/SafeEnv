import { ScanResult } from '../../../src/core/types';

/**
 * Creates and shows a Shadow DOM based alert modal.
 */
export function showShadowAlert(result: ScanResult, originalText: string): void {
    // 1. Create Host Element
    const host = document.createElement('div');
    host.id = 'safeenv-ghost-vault-alert';
    host.style.cssText = 'all: initial; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2147483647; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); pointer-events: auto;';

    // 2. Attach Closed Shadow Root
    const shadow = host.attachShadow({ mode: 'closed' });

    // 3. Inject Styles
    const style = document.createElement('style');
    style.textContent = `
    .modal {
      background: #1e1e1e;
      color: #ffffff;
      padding: 24px;
      border-radius: 12px;
      border: 2px solid #ff4d4d;
      max-width: 450px;
      width: 90%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
    }
    .header {
      color: #ff4d4d;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .description {
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 24px;
      color: #cccccc;
    }
    .matches {
      background: #2d2d2d;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 24px;
      text-align: left;
    }
    .match-item {
      font-family: monospace;
      color: #ffa07a;
      font-size: 13px;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    button {
      padding: 12px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    button:hover {
      opacity: 0.9;
    }
    .btn-safe {
      background: #ff4d4d;
      color: white;
    }
    .btn-cancel {
      background: #3d3d3d;
      color: white;
    }
  `;
    shadow.appendChild(style);

    // 4. Create Modal Structure
    const modal = document.createElement('div');
    modal.className = 'modal';

    const providerList = [...new Set(result.matches.map(m => m.provider))].join(', ');

    modal.innerHTML = `
    <div class="header">
      <span>🛡️ GhostVault Protected</span>
    </div>
    <div class="description">
      We intercepted a paste containing secrets for: <strong>${providerList}</strong>. 
      To prevent accidental exposure, we've blocked the raw paste.
    </div>
    <div class="matches">
      ${result.matches.map(m => `<div class="match-item">${m.provider}: ${m.type}</div>`).join('')}
    </div>
    <div class="actions">
      <button class="btn-safe" id="copy-safe">Copy Safe Version (Env Var)</button>
      <button class="btn-cancel" id="cancel">Cancel Paste</button>
    </div>
  `;

    shadow.appendChild(modal);
    document.body.appendChild(host);

    // 5. Wire Up Events
    const firstMatch = result.matches[0];
    const varName = `${firstMatch.provider.toUpperCase()}_API_KEY`;

    shadow.getElementById('copy-safe')?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(`process.env.${varName}`);
            alert(`Safe reference copied! Please paste it into your code.`);
            host.remove();
        } catch (err) {
            console.error('Failed to write to clipboard', err);
        }
    });

    shadow.getElementById('cancel')?.addEventListener('click', () => {
        host.remove();
    });
}
