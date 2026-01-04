# SafeEnv (GhostVault)

## The Seatbelt for Vibe Coding
> **Protect your API keys from the chaos of modern AI development.**

SafeEnv (GhostVault) is a privacy-first security tool designed for the "Vibe Coding" era. Whether you're copying code from ChatGPT, pasting into Lovable, or rapid-prototyping in VS Code, SafeEnv acts as a local sentinel, intercepting secrets *before* they leak.

---

## Why SafeEnv?

### 🛡️ Local-Only (Zero Data Exfiltration)
Your secrets are yours. SafeEnv processes everything **on-device**. No cloud services. No telemetry. No risk.

### ⚡ 0ms Latency
Built with a highly optimized regex engine (and future-proofed for Rust/WASM), SafeEnv scans your clipboard instantly. You won't feel a thing—until it saves you.

### 🌐 Cross-Platform Protection
- **VS Code Extension:** Protects your local development workflow.
- **Chrome Extension:** Protects you on Web IDEs like **Lovable.dev**, **Bolt.new**, and **Replit**.

---

## Features

- **Clipboard Sentinel:** Intercepts paste events containing high-entropy strings (AWS, Stripe, OpenAI keys).
- **Ghost Alerts:** Non-intrusive UI overlays (Shadow DOM) that warn you without breaking your flow.
- **Auto-Injection:** One-click to inject a detected secret as a `process.env` variable instead of raw text.
- **Git Guardian:** Automatically ensures sensitive files like `.env` are added to `.gitignore`.

---

## Installation

### VS Code Extension
1.  Open VS Code.
2.  Go to Extensions (Ctrl+Shift+X).
3.  Search for **SafeEnv**.
4.  Install and reload.

### Chrome Extension
1.  Download the latest release from the [Chrome Web Store](#) (Coming Soon).
2.  **Manual Install:**
    - Clone this repo.
    - Go to `chrome://extensions`.
    - Enable "Developer Mode".
    - Click "Load unpacked" and select the `browser-extension` folder.

---

## Supported Patterns
SafeEnv currently detects:
- **AWS Access Keys** (`AKIA...`)
- **Stripe Secret Keys** (`sk_live_...`)
- **OpenAI API Keys** (`sk-...`)
- **Generic High-Entropy Strings** (Experimental)

---

## Disclaimer
> **PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.**

SafeEnv is a helper tool to assist in detecting accidental secret exposure. It is **not** a guarantee of security. The authors are not liable for any data leaks, financial loss, or damages arising from the use or failure of this software. Always review your code before committing.

---

## License
MIT © [ThaRealJozef](https://github.com/tharealjozef)
