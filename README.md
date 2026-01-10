# SafeEnv 🛡️
### *The "Oh Sh\*t" Button for your Clipboard.*

<div align="center">

  <a href="https://marketplace.visualstudio.com/items?itemName=ThaRealJozef.safeenv">
    <img src="https://img.shields.io/visual-studio-marketplace/v/ThaRealJozef.safeenv?style=for-the-badge&logo=visual-studio-code" alt="VS Code Marketplace" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Chrome_Web_Store-Coming_Soon-grey?style=for-the-badge&logo=google-chrome" alt="Chrome Web Store" />
  </a>
</div>

---

### Tl;dr 💥
You're "Vibe Coding" at 3AM. You copy a script from ChatGPT. You paste it into `prod.js`.
**CONGRATS!** You just leaked your AWS Secret Key to GitHub. Your CTO is calling. You are crying.

> **Why this exists:**
> A student recently woke up to a **$55,000 debt** because they accidentally leaked an API key on GitHub. It took 2 days to rack up that bill.
> *Don't be like that student.* (Thankfully, Google waived it, but your CTO might not be as nice).

**SafeEnv stops that.**
Matches text against patterns ➜ intercepts paste ➜ you live to code another day.

---

## 🌍 Works Everywhere (Seriously)
If it looks like VS Code, we probably run on it.

| ⚡ Native Support | 🌲 The Forks | ☁️ In The Cloud |
| :--- | :--- | :--- |
| <img src="https://www.google.com/s2/favicons?domain=cursor.sh&sz=64" height="14"/> **Cursor**<br><img src="https://antigravity.google/assets/image/blog/blog-feature-introducing-google-antigravity.png" height="14"/> **Antigravity**<br><img src="https://www.google.com/s2/favicons?domain=code.visualstudio.com&sz=64" height="14"/> **VS Code**<br><img src="https://www.google.com/s2/favicons?domain=windsurf.ai&sz=64" height="14"/> **Windsurf** | <img src="https://media.licdn.com/dms/image/v2/D560BAQGDj8tODOUsMA/company-logo_200_200/B56Zgd1b5THMAI-/0/1752847204537/traeai_logo?e=2147483647&v=beta&t=N2wG8glnNTLiGMWcuCqq8WigDQVc9ycsocKCOXqwtgM" height="14"/> **Trae**<br><img src="https://www.google.com/s2/favicons?domain=trypear.ai&sz=64" height="14"/> **PearAI**<br><img src="https://avatars.githubusercontent.com/u/165039930?s=200&v=4" height="14"/> **Void**<br><img src="https://www.google.com/s2/favicons?domain=vscodium.com&sz=64" height="14"/> **VSCodium** | <img src="https://www.google.com/s2/favicons?domain=idx.dev&sz=64" height="14"/> **Project IDX**<br><img src="https://github.githubassets.com/favicons/favicon.png" height="14"/> **Codespaces**<br><img src="https://www.google.com/s2/favicons?domain=stackblitz.com&sz=64" height="14"/> **StackBlitz** |

> **Web Devs:** We also have a Chrome Extension for **Replit**, **Bolt.new**, and **Lovable**. Because friends don't let friends paste raw secrets into web terminals.

---

## 🚀 Features (V1.4)

### 🦀 **Rust/WASM Core Engine**
The scanner is powered by **Rust compiled to WebAssembly**:
- **10x faster** than a pure JavaScript engine.
- **Zero ReDoS risk** — Rust's regex engine doesn't backtrack.
- **50+ prefix-based patterns** — High precision, zero false positives.

### ⚡ **"The Flash" Mode (Async Scanning)**
Pasting a 50MB log file? **We won't freeze your editor.**
Our engine blocks the paste *instantly*, spins up a background worker, and only lets the text through if it's clean.

### 👻 **Ghost Mode**
We catch the secrets in the **Capture Phase**. The website or IDE never even *sees* the sensitive data until we say so. It's like a bouncer for your clipboard.

### ☁️ **Cloud Pattern Sync** *(Pro)*
Stay protected against the latest threats. Pro users can **sync patterns from SafeEnv Cloud** — we update our detection library regularly so you don't have to.

### 🛡️ **Custom Shield Patterns**
Got a weird internal company format like `ACME__KEY__999`? Use our **guided wizard** to add custom patterns — no regex knowledge required!
- Step 1: Pick a secret type
- Step 2: Enter the prefix
- Step 3: Name it
- Done! SafeEnv handles the rest.

### 📋 **Smart Allowlist**
Got a dummy key like `sk_test_123`? Add it to the **Allow List**.
We don't judge. We just block.

---

## 🎯 What We Catch (The Hall of Shame)

> *"If you can leak it, we can detect it."*

We've studied the **GitGuardian Annual Reports**, stalked **HaveIBeenPwned**, and lurked in Discord servers where people cry about leaked keys. Here's our hit list:

<details>
<summary><b>🤖 AI & LLMs</b> — <i>Because ChatGPT isn't free, and neither are your tears.</i></summary>

| Provider | Token Types |
|----------|-------------|
| **OpenAI** | Legacy `sk-`, Project `sk-proj-` |
| **Anthropic** | Claude `sk-ant-api03-` |
| **Hugging Face** | `hf_` tokens |
| **Perplexity** | `pplx-` keys |
| **xAI (Grok)** | `xai-` keys |
| **Groq** | `gsk_` tokens |
| **Replicate** | `r8_` tokens |

</details>

<details>
<summary><b>☁️ Cloud Providers</b> — <i>Where one leaked key = one kidney.</i></summary>

| Provider | Token Types |
|----------|-------------|
| **AWS** | `AKIA`, `ASIA`, `ABIA`, `ACCA` Access Keys |
| **Google Cloud** | `AIza` keys, `ya29.` OAuth tokens |
| **Alibaba Cloud** | `LTAI` keys |
| **DigitalOcean** | `dop_v1_` tokens |
| **Vercel** | `vercel_` tokens |
| **Supabase** | `sbp_` service keys |
| **PlanetScale** | `pscale_tkn_` tokens |
| **Fly.io** | `fo1_` tokens |
| **Render** | `rnd_` keys |

</details>

<details>
<summary><b>🗄️ Databases</b> — <i>Your connection string is not a love letter. Don't share it.</i></summary>

| Database | What We Catch |
|----------|---------------|
| **MongoDB** | `mongodb://user:pass@...`, `mongodb+srv://` |
| **PostgreSQL** | `postgres://user:pass@...` |
| **MySQL** | `mysql://user:pass@...` |
| **Redis** | `redis://` with credentials |

</details>

<details>
<summary><b>🛠️ DevOps & Version Control</b> — <i>Your CI/CD pipeline is not a confession booth.</i></summary>

| Platform | Token Types |
|----------|-------------|
| **GitHub** | `ghp_`, `github_pat_`, `gho_` |
| **GitLab** | `glpat-` |
| **NPM** | `npm_` tokens |
| **PyPI** | `pypi-AgEI...` tokens |
| **Docker Hub** | `dckr_pat_` |
| **SonarQube** | `squ_` tokens |

</details>

<details>
<summary><b>📧 Communication & Email</b> — <i>Sending spam is expensive. Ask the hackers who stole your key.</i></summary>

| Service | Token Types |
|---------|-------------|
| **SendGrid** | `SG.xxxxx.xxxxx` (The #1 leaked key of 2024!) |
| **Twilio** | `AC` SIDs |
| **Mailgun** | `key-` prefixed |
| **Mailchimp** | API keys with `-us` suffix |
| **Resend** | `re_` keys |
| **Slack** | `xoxb-`, `xoxp-`, Webhooks |
| **Discord** | Bot tokens, Webhook URLs |
| **Telegram** | Bot tokens `123456789:ABC...` |

</details>

<details>
<summary><b>💳 Payments & Fintech</b> — <i>Your Stripe key is worth more than your car.</i></summary>

| Provider | Token Types |
|----------|-------------|
| **Stripe** | `sk_live_`, `sk_test_`, `rk_`, `whsec_` |
| **Square** | `sq0atp-` |
| **Shopify** | `shpat_` |

</details>

<details>
<summary><b>📊 Analytics & Monitoring</b> — <i>Leaking your Sentry DSN is just... ironic.</i></summary>

| Service | Token Types |
|---------|-------------|
| **Sentry** | DSN URLs, `sntrys_` auth tokens |
| **New Relic** | `NRAK-` |
| **Grafana** | `glc_` cloud tokens |

</details>

<details>
<summary><b>🌐 Social & Productivity</b> — <i>Your Instagram token is not a flex.</i></summary>

| Platform | Token Types |
|----------|-------------|
| **Facebook/Meta** | `EAA` access tokens |
| **Airtable** | `key` tokens |
| **Notion** | `secret_` integration tokens |
| **Figma** | `figd_` personal tokens |

</details>

<details>
<summary><b>🔒 Generic Secrets</b> — <i>The universal catch-alls.</i></summary>

| Type | Pattern |
|------|---------|
| **Private Keys** | PEM format (`-----BEGIN ... PRIVATE KEY-----`) |

</details>

> **Missing your favorite service?** [Open an issue](https://github.com/tharealjozef/SafeEnv/issues) or contribute a pattern. We're always hungry for more.

---

## 📦 How to Install

### 💻 Desktop (Cursor / Antigravity / VS Code / Windsurf / etc...)

**Method 1: The "I have a mouse" way**
1.  Click the **Extensions** icon in the sidebar.
2.  Search for `SafeEnv`.
3.  Click **Install**.

**Method 2: The "Hacker" way**
1.  Hit `Ctrl+P` (or `Cmd+P` on Mac).
2.  Type `ext install ThaRealJozef.safeenv`.
3.  Hit Enter.

### ☁️ Cloud (IDX / Codespaces)
*   **Project IDX:** Open Extensions panel ➜ Search "SafeEnv".
*   **Codespaces:** Add to `.devcontainer.json`:
    ```json
    "customizations": { "vscode": { "extensions": ["ThaRealJozef.safeenv"] } }
    ```

---

## ⚖️ Disclaimer & Legal

> **SafeEnv is a "best effort" security tool, NOT a guarantee.**

### What We Promise:
✅ We **try really hard** to catch secrets before they leak.
✅ We run **100% locally** — your data never leaves your machine.
✅ We are **open source** — audit us if you don't trust us.

### What We DON'T Promise:
❌ **We cannot catch every secret ever.** New providers pop up daily.
❌ **We are not liable** if something slips through. This is a TOOL, not insurance.
❌ **We cannot protect you from yourself.** If you ignore our warnings, that's on you.

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
You use SafeEnv at your own risk.
```

> **TL;DR:** We're here to help, not to babysit. Use us as ONE layer of your security, not your ONLY layer.

**[Contribute on GitHub](https://github.com/tharealjozef/SafeEnv)**

---

## 🛠️ For Contributors

### Building the Rust/WASM Core
If you need to modify the scanning engine (`src/rust/`):

1. **Install Rust:** https://rustup.rs/
2. **Install wasm-pack:**
   ```bash
   cargo install wasm-pack
   ```
3. **Build WASM:**
   ```bash
   npm run build:wasm
   ```
4. **Compile TypeScript:**
   ```bash
   npm run compile
   ```

> **Note:** End users do NOT need Rust installed. The compiled `.wasm` binary is committed to the repo.

---

Happy (Safe) Coding! 🛡️
