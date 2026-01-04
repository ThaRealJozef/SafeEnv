# SafeEnv (GhostVault) 👻🛡️
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
| <img src="https://www.google.com/s2/favicons?domain=cursor.sh&sz=64" height="14"/> **Cursor**<br><img src="https://antigravity.google/assets/image/blog/blog-feature-introducing-google-antigravity.png" height="14"/> **Antigravity**<br><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/32px-Visual_Studio_Code_1.35_icon.svg.png" height="14"/> **VS Code**<br><img src="https://www.google.com/s2/favicons?domain=windsurf.ai&sz=64" height="14"/> **Windsurf** | <img src="https://media.licdn.com/dms/image/v2/D560BAQGDj8tODOUsMA/company-logo_200_200/B56Zgd1b5THMAI-/0/1752847204537/traeai_logo?e=2147483647&v=beta&t=N2wG8glnNTLiGMWcuCqq8WigDQVc9ycsocKCOXqwtgM" height="14"/> **Trae**<br><img src="https://www.google.com/s2/favicons?domain=trypear.ai&sz=64" height="14"/> **PearAI**<br><img src="https://avatars.githubusercontent.com/u/165039930?s=200&v=4" height="14"/> **Void**<br><img src="https://www.google.com/s2/favicons?domain=vscodium.com&sz=64" height="14"/> **VSCodium** | <img src="https://www.google.com/s2/favicons?domain=idx.dev&sz=64" height="14"/> **Project IDX**<br><img src="https://github.githubassets.com/favicons/favicon.png" height="14"/> **Codespaces**<br><img src="https://www.google.com/s2/favicons?domain=stackblitz.com&sz=64" height="14"/> **StackBlitz** |

> **Web Devs:** We also have a Chrome Extension for **Replit**, **Bolt.new**, and **Lovable**. Because friends don't let friends paste raw secrets into web terminals.

---

## 🚀 Features (V1.1)

### ⚡ **"The Flash" Mode (Async Scanning)**
Pasting a 50MB log file? **We won't freeze your editor.**
Our new V1.1 engine blocks the paste *instantly*, spins up a background worker, and only lets the text through if it's clean. It's faster than you can say "segfault".

### 👻 **Ghost Mode**
We catch the secrets in the **Capture Phase**. This means the website or IDE never even *sees* the sensitive data until we say so. It's like a bouncer for your clipboard.

### 🛡️ **"Not My Business" Lists**
Got a dummy key like `sk_test_123`? Add it to the **Allow List**.
Got a weird internal company format like `ACME__KEY__999`? Add a **Custom Pattern**.
We don't judge. We just block.

---

## 📦 How to Install
> **🚧 Status: Coming Soon to all marketplaces.**
> *Presave these instructions for the drop.*

### 💻 Desktop (Cursor / Antigravity / VS Code / Windsurf / etc...)

**Method 1: The "I have a mouse" way**
1.  Click the **Extensions** icon in the sidebar (the Tetris block thing).
2.  Search for `SafeEnv`.
3.  Click **Install**.

**Method 2: The "Hacker" way**
1.  **Once Live:** Hit `Ctrl+P` (or `Cmd+P` if you're fancy).
2.  Type `ext install ThaRealJozef.safeenv`.
3.  Hit Enter. Done. You are now safer than 99% of developers.

### ☁️ Cloud (IDX / Codespaces)
*   **Project IDX:** Open Extensions panel ➜ Search "SafeEnv" *(Coming Soon)*.
*   **Codespaces:** Add to `.devcontainer.json` when live:
    ```json
    "customizations": { "vscode": { "extensions": ["ThaRealJozef.safeenv"] } }
    ```

---

## 🛑 The Legal Stuff (Boring but Important)
SafeEnv is a tool, not a guarantee. If you write your password on a post-it note and stick it to your monitor, we can't help you.
*   **We run LOCAL ONLY.** No data leaves your machine.
*   **We are Open Source.** Audit us if you have trust issues (we respect that).
*   **Use common sense.**

**[Contribute on GitHub](https://github.com/tharealjozef/SafeEnv)** if you want to add more patterns or fix my terrible TypeScript.

Happy (Safe) Coding! 👻
