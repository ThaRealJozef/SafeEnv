// GhostVault Control Center - Vanilla JS UI Logic
// @ts-check

(function () {
    /** 
     * @typedef {Object} Pattern
     * @property {string} id
     * @property {string} name
     * @property {string} regex
     * @property {string} provider
     * @property {string} type
     * @property {boolean} enabled
     */

    /**
     * @typedef {Object} State
     * @property {boolean} isPro
     * @property {number} maxPatterns
     * @property {number} patternCount
     * @property {number} secretsBlocked
     * @property {Pattern[]} patterns
     */

    // @ts-ignore
    const vscode = acquireVsCodeApi();

    /** @type {State} */
    let state = {
        isPro: false,
        maxPatterns: 1,
        patternCount: 0,
        secretsBlocked: 0,
        patterns: []
    };

    // DOM Elements
    const secretsBlockedEl = /** @type {HTMLElement} */ (document.getElementById('secrets-blocked'));
    const patternCounterEl = /** @type {HTMLElement} */ (document.getElementById('pattern-counter'));
    const patternListEl = /** @type {HTMLElement} */ (document.getElementById('pattern-list'));
    const addPatternBtn = /** @type {HTMLButtonElement} */ (document.getElementById('add-pattern-btn'));
    const syncBtn = /** @type {HTMLButtonElement} */ (document.getElementById('sync-btn'));
    const licenseInput = /** @type {HTMLInputElement} */ (document.getElementById('license-input'));
    const activateBtn = /** @type {HTMLButtonElement} */ (document.getElementById('activate-btn'));
    const refreshBtn = /** @type {HTMLButtonElement} */ (document.getElementById('refresh-btn'));

    // New Elements
    const licenseForm = /** @type {HTMLElement} */ (document.getElementById('license-form'));
    const proStatus = /** @type {HTMLElement} */ (document.getElementById('pro-status'));
    const deactivateBtn = /** @type {HTMLButtonElement} */ (document.getElementById('deactivate-btn'));

    // Listen for messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;

        switch (message.command) {
            case 'updateState':
                state = message.payload;
                render();
                break;
            case 'error':
                showMessage(message.message, 'error');
                break;
        }
    });

    // Render UI based on current state
    function render() {
        // Toggle License Form vs Pro Status
        if (licenseForm && proStatus) {
            if (state.isPro) {
                licenseForm.style.display = 'none';
                proStatus.style.display = 'block';
            } else {
                licenseForm.style.display = 'block';
                proStatus.style.display = 'none';
            }
        }

        // Update dashboard stats
        if (secretsBlockedEl) {
            secretsBlockedEl.textContent = state.secretsBlocked.toString();
        }

        // Update pattern counter
        if (patternCounterEl) {
            const counterText = state.isPro
                ? `Slots: ${state.patternCount} / ∞`
                : `Slots: ${state.patternCount} / ${state.maxPatterns}`;

            patternCounterEl.textContent = counterText;

            if (!state.isPro && state.patternCount >= state.maxPatterns) {
                patternCounterEl.classList.add('limit-reached');
            } else {
                patternCounterEl.classList.remove('limit-reached');
            }
        }

        // Render pattern list
        if (patternListEl) {
            patternListEl.innerHTML = '';
            state.patterns.forEach(pattern => {
                const li = document.createElement('li');
                li.className = 'pattern-item';
                li.innerHTML = `
                    <div>
                        <div class="name">${escapeHtml(pattern.name)}</div>
                        <div class="provider">${escapeHtml(pattern.provider)} - ${escapeHtml(pattern.type)}</div>
                    </div>
                    <button class="delete-btn" data-id="${escapeHtml(pattern.id)}">×</button>
                `;
                patternListEl.appendChild(li);
            });

            // Attach delete handlers
            patternListEl.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (/** @type {any} */ e) => {
                    const target = /** @type {HTMLElement} */ (e.target);
                    const id = target.getAttribute('data-id');
                    if (id) deletePattern(id);
                });
            });
        }

        // Update sync button
        if (syncBtn) {
            if (state.isPro) {
                syncBtn.disabled = false;
                syncBtn.classList.remove('locked');
                syncBtn.textContent = '☁️ Sync';
            } else {
                syncBtn.disabled = true;
                syncBtn.classList.add('locked');
                syncBtn.textContent = '☁️ Sync';
            }
        }

        // Show Pro badge if applicable
        const h2Elements = document.querySelectorAll('h2');
        h2Elements.forEach(h2 => {
            const existingBadge = h2.querySelector('.pro-badge');
            if (state.isPro && !existingBadge) {
                const badge = document.createElement('span');
                badge.className = 'pro-badge';
                badge.textContent = 'PRO';
                h2.appendChild(badge);
            }
        });

        // Update Add Pattern Button State
        if (addPatternBtn) {
            const limitReached = !state.isPro && state.patternCount >= state.maxPatterns;
            if (limitReached) {
                addPatternBtn.textContent = '💎 Upgrade to Add More';
                addPatternBtn.classList.add('upgrade');
            } else {
                addPatternBtn.textContent = '+ Add Pattern';
                addPatternBtn.classList.remove('upgrade');
            }
        }
    }

    // Refresh Button Handler
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'refresh' });
            // Add rotation animation class temporarily
            refreshBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                refreshBtn.style.transform = '';
            }, 500);
        });
    }

    // Add Pattern Handler
    if (addPatternBtn) {
        addPatternBtn.addEventListener('click', () => {
            // Check limit locally
            if (!state.isPro && state.patternCount >= state.maxPatterns) {
                // Focus the license input for better UX
                if (licenseInput) {
                    licenseInput.focus();
                    licenseInput.scrollIntoView({ behavior: 'smooth' });
                    showMessage('👇 Enter your Pro key below to unlock unlimited patterns!', 'success');
                } else {
                    showUpgradeModal();
                }
                return;
            }

            // Trigger VS Code native input flow
            vscode.postMessage({
                command: 'requestAddPattern'
            });
        });
    }

    // Delete Pattern Handler
    /** @param {string} id */
    function deletePattern(id) {
        vscode.postMessage({
            command: 'deletePattern',
            payload: { id }
        });
    }

    // Activate License Handler
    if (activateBtn) {
        activateBtn.addEventListener('click', () => {
            const key = licenseInput?.value.trim();
            if (!key) {
                showMessage('Please enter a license key', 'error');
                return;
            }

            vscode.postMessage({
                command: 'activateLicense',
                key: key
            });

            // Clear input
            if (licenseInput) {
                licenseInput.value = '';
            }
        });
    }

    // Sync Button Handler
    if (syncBtn) {
        syncBtn.addEventListener('click', () => {
            if (!state.isPro) {
                showUpgradeModal();
                return;
            }
            showMessage('Cloud sync coming soon!', 'success');
        });
    }

    // Deactivate License Handler
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => {
            vscode.postMessage({ command: 'deactivateLicense' });
        });
    }

    // Show Upgrade Modal
    function showUpgradeModal() {
        const message = `🚀 Upgrade to Pro to unlock unlimited custom patterns!\n\nEnter "PRO-DEMO-KEY" in the Settings tab to try it out.`;
        alert(message);
    }

    // Show Message
    /** 
     * @param {string} text
     * @param {string} type
     */
    function showMessage(text, type = 'error') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;

        const app = document.getElementById('app');
        if (app) {
            app.insertBefore(messageDiv, app.firstChild);

            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

        // Trigger confetti on success
        if (type === 'success' && text.toLowerCase().includes('pro')) {
            triggerConfetti();
        }
    }

    // Confetti Effect
    function triggerConfetti() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = /** @type {HTMLElement} */ (document.createElement('div'));
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.background = ['#fbbf24', '#ef4444', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 4)];
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 1000);
            }, i * 50);
        }
    }

    // Utility: Generate ID
    function generateId() {
        return 'pattern_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Utility: Escape HTML
    /** @param {string} text */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Request initial state
    vscode.postMessage({ command: 'refresh' });
})();
