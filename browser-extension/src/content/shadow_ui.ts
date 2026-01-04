import { ScanResult } from '../../../src/core/types';

const SCANNING_INDICATOR_ID = 'safeenv-scanning-indicator';

/**
 * Shows a subtle scanning indicator in the bottom-right corner.
 */
export function showScanningState(): void {
  // Remove existing indicator if present
  hideScanningState();

  const indicator = document.createElement('div');
  indicator.id = SCANNING_INDICATOR_ID;
  indicator.style.cssText = `
    all: initial;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2147483646;
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 12px 18px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeIn 0.2s ease-out;
  `;

  indicator.innerHTML = `
    <div style="
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ef4444;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    "></div>
    <span>Scanning...</span>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  document.body.appendChild(indicator);
}

/**
 * Hides the scanning indicator.
 */
export function hideScanningState(): void {
  const existing = document.getElementById(SCANNING_INDICATOR_ID);
  if (existing) {
    existing.remove();
  }
}

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
    /* --- Modal Container with Glassmorphism --- */
    .modal {
      background: rgba(20, 20, 20, 0.85);
      color: #ffffff;
      padding: 28px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 480px;
      width: 90%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      text-align: center;

      /* Glassmorphism */
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);

      /* Entry Animation */
      animation: modal-entry 0.3s ease-out forwards;
    }

    /* --- Entry Animation Keyframes --- */
    @keyframes modal-entry {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* --- Header Styling --- */
    .header {
      color: #ef4444; /* Tailwind red-500 */
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    /* --- Description Text --- */
    .description {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
      color: #a3a3a3;
    }

    /* --- Match List Container --- */
    .matches {
      background: rgba(255, 255, 255, 0.05);
      padding: 14px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: left;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .match-item {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      color: #fb923c; /* Tailwind orange-400 */
      font-size: 13px;
      padding: 4px 0;
    }

    /* --- Action Buttons --- */
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    button {
      padding: 14px 18px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    button:hover {
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    .btn-safe {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.1);
      color: #d4d4d4;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `;
  shadow.appendChild(style);

  // 4. Create Modal Structure
  const modal = document.createElement('div');
  modal.className = 'modal';

  const providerList = [...new Set(result.matches.map(m => m.provider))].join(', ');
  const secretCount = result.matches.length;

  modal.innerHTML = `
    <div class="header">
      <span>🛡️ GhostVault Protected</span>
    </div>
    <div class="description">
      SafeEnv intercepted a paste containing <strong>${secretCount}</strong> potential secret(s) from <strong>${providerList}</strong>.
      To prevent accidental exposure, the raw paste has been blocked.
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
      // User-facing error instead of console
      alert('Failed to write to clipboard. Please check browser permissions.');
      host.remove();
    }
  });

  shadow.getElementById('cancel')?.addEventListener('click', () => {
    host.remove();
  });
}
