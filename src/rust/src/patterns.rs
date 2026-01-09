use regex::Regex;
use lazy_static::lazy_static;
use crate::scanner::PatternDef;

lazy_static! {
    /// SafeEnv v1.2 Pattern Dictionary
    /// Only includes patterns with SPECIFIC PREFIXES to avoid false positives.
    /// Generic patterns (like "any 32 char hex") are intentionally excluded.
    pub static ref PATTERNS: Vec<PatternDef> = vec![
        // ==========================================
        // 🤖 ARTIFICIAL INTELLIGENCE
        // ==========================================

        // OpenAI - Legacy
        PatternDef {
            provider: "OpenAI",
            match_type: "Legacy API Key",
            regex: Regex::new(r"\bsk-[a-zA-Z0-9]{48}\b").unwrap(),
        },
        // OpenAI - Project Key
        PatternDef {
            provider: "OpenAI",
            match_type: "Project API Key",
            regex: Regex::new(r"\bsk-proj-[a-zA-Z0-9\-_]{48,}\b").unwrap(),
        },

        // Anthropic (Claude)
        PatternDef {
            provider: "Anthropic",
            match_type: "API Key",
            regex: Regex::new(r"\bsk-ant-api03-[a-zA-Z0-9\-_]{20,}\b").unwrap(),
        },

        // Hugging Face
        PatternDef {
            provider: "Hugging Face",
            match_type: "Access Token",
            regex: Regex::new(r"\bhf_[a-zA-Z0-9]{34}\b").unwrap(),
        },

        // Perplexity AI
        PatternDef {
            provider: "Perplexity",
            match_type: "API Key",
            regex: Regex::new(r"\bpplx-[a-zA-Z0-9]{48,}\b").unwrap(),
        },

        // xAI (Grok)
        PatternDef {
            provider: "xAI (Grok)",
            match_type: "API Key",
            regex: Regex::new(r"\bxai-[a-zA-Z0-9]{48,}\b").unwrap(),
        },

        // Groq
        PatternDef {
            provider: "Groq",
            match_type: "API Key",
            regex: Regex::new(r"\bgsk_[a-zA-Z0-9]{52}\b").unwrap(),
        },

        // Replicate
        PatternDef {
            provider: "Replicate",
            match_type: "API Token",
            regex: Regex::new(r"\br8_[a-zA-Z0-9]{40}\b").unwrap(),
        },

        // ==========================================
        // ☁️ CLOUD PROVIDERS
        // ==========================================

        // AWS Access Key
        PatternDef {
            provider: "AWS",
            match_type: "Access Key ID",
            regex: Regex::new(r"(?i)\b(AKIA|ASIA|ABIA|ACCA)[0-9A-Z]{16}\b").unwrap(),
        },

        // Google Cloud API Key
        PatternDef {
            provider: "Google",
            match_type: "API Key",
            regex: Regex::new(r"\bAIza[0-9A-Za-z\-_]{35}\b").unwrap(),
        },

        // Google OAuth
        PatternDef {
            provider: "Google",
            match_type: "OAuth Token",
            regex: Regex::new(r"\bya29\.[0-9A-Za-z\-_]{50,}\b").unwrap(),
        },

        // Alibaba Cloud
        PatternDef {
            provider: "Alibaba Cloud",
            match_type: "Access Key ID",
            regex: Regex::new(r"\bLTAI[a-zA-Z0-9]{20}\b").unwrap(),
        },

        // DigitalOcean
        PatternDef {
            provider: "DigitalOcean",
            match_type: "Personal Access Token",
            regex: Regex::new(r"\bdop_v1_[a-f0-9]{64}\b").unwrap(),
        },

        // Vercel
        PatternDef {
            provider: "Vercel",
            match_type: "API Token",
            regex: Regex::new(r"\bvercel_[a-zA-Z0-9]{24}\b").unwrap(),
        },

        // Supabase
        PatternDef {
            provider: "Supabase",
            match_type: "Service Key",
            regex: Regex::new(r"\bsbp_[a-f0-9]{40}\b").unwrap(),
        },

        // PlanetScale
        PatternDef {
            provider: "PlanetScale",
            match_type: "Service Token",
            regex: Regex::new(r"\bpscale_tkn_[a-zA-Z0-9_]{43}\b").unwrap(),
        },

        // Render
        PatternDef {
            provider: "Render",
            match_type: "API Key",
            regex: Regex::new(r"\brnd_[a-zA-Z0-9]{32}\b").unwrap(),
        },

        // Fly.io
        PatternDef {
            provider: "Fly.io",
            match_type: "API Token",
            regex: Regex::new(r"\bfo1_[a-zA-Z0-9_\-]{43}\b").unwrap(),
        },

        // ==========================================
        // 🗄️ DATABASES (Connection Strings)
        // ==========================================

        // MongoDB
        PatternDef {
            provider: "MongoDB",
            match_type: "Connection String",
            regex: Regex::new(r"mongodb(\+srv)?://[^:]+:[^@]+@[^\s]+").unwrap(),
        },

        // PostgreSQL
        PatternDef {
            provider: "PostgreSQL",
            match_type: "Connection String",
            regex: Regex::new(r"postgres(ql)?://[^:]+:[^@]+@[^\s]+").unwrap(),
        },

        // MySQL
        PatternDef {
            provider: "MySQL",
            match_type: "Connection String",
            regex: Regex::new(r"mysql://[^:]+:[^@]+@[^\s]+").unwrap(),
        },

        // Redis
        PatternDef {
            provider: "Redis",
            match_type: "Connection String",
            regex: Regex::new(r"redis://[^:]*:[^@]+@[^\s]+").unwrap(),
        },

        // ==========================================
        // 🛠️ DEVOPS & VERSION CONTROL
        // ==========================================

        // GitHub PAT
        PatternDef {
            provider: "GitHub",
            match_type: "Classic PAT",
            regex: Regex::new(r"\bghp_[a-zA-Z0-9]{36}\b").unwrap(),
        },
        PatternDef {
            provider: "GitHub",
            match_type: "Fine-Grained Token",
            regex: Regex::new(r"\bgithub_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}\b").unwrap(),
        },
        PatternDef {
            provider: "GitHub",
            match_type: "OAuth Token",
            regex: Regex::new(r"\bgho_[a-zA-Z0-9]{36}\b").unwrap(),
        },

        // GitLab
        PatternDef {
            provider: "GitLab",
            match_type: "Personal Access Token",
            regex: Regex::new(r"\bglpat-[0-9a-zA-Z\-_]{20}\b").unwrap(),
        },

        // NPM
        PatternDef {
            provider: "NPM",
            match_type: "Access Token",
            regex: Regex::new(r"\bnpm_[a-zA-Z0-9]{36}\b").unwrap(),
        },

        // PyPI
        PatternDef {
            provider: "PyPI",
            match_type: "API Token",
            regex: Regex::new(r"\bpypi-AgEIcHlwaS5vcmc[a-zA-Z0-9\-_]{50,}\b").unwrap(),
        },

        // Docker Hub
        PatternDef {
            provider: "Docker Hub",
            match_type: "Access Token",
            regex: Regex::new(r"\bdckr_pat_[a-zA-Z0-9\-_]{27}\b").unwrap(),
        },

        // SonarQube
        PatternDef {
            provider: "SonarQube",
            match_type: "Token",
            regex: Regex::new(r"\bsqu_[a-f0-9]{40}\b").unwrap(),
        },

        // ==========================================
        // 📧 COMMUNICATION
        // ==========================================

        // SendGrid
        PatternDef {
            provider: "SendGrid",
            match_type: "API Key",
            regex: Regex::new(r"\bSG\.[a-zA-Z0-9\-_]{22}\.[a-zA-Z0-9\-_]{43}\b").unwrap(),
        },

        // Mailgun
        PatternDef {
            provider: "Mailgun",
            match_type: "API Key",
            regex: Regex::new(r"\bkey-[a-f0-9]{32}\b").unwrap(),
        },

        // Mailchimp
        PatternDef {
            provider: "Mailchimp",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{32}-us[0-9]{1,2}\b").unwrap(),
        },

        // Resend
        PatternDef {
            provider: "Resend",
            match_type: "API Key",
            regex: Regex::new(r"\bre_[a-zA-Z0-9]{32}\b").unwrap(),
        },

        // Twilio
        PatternDef {
            provider: "Twilio",
            match_type: "Account SID",
            regex: Regex::new(r"\bAC[a-f0-9]{32}\b").unwrap(),
        },

        // Slack
        PatternDef {
            provider: "Slack",
            match_type: "Bot Token",
            regex: Regex::new(r"\bxoxb-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}\b").unwrap(),
        },
        PatternDef {
            provider: "Slack",
            match_type: "User Token",
            regex: Regex::new(r"\bxoxp-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}\b").unwrap(),
        },
        PatternDef {
            provider: "Slack",
            match_type: "Webhook URL",
            regex: Regex::new(r"https://hooks\.slack\.com/services/T[a-zA-Z0-9]+/B[a-zA-Z0-9]+/[a-zA-Z0-9]+").unwrap(),
        },

        // Discord
        PatternDef {
            provider: "Discord",
            match_type: "Bot Token",
            regex: Regex::new(r"\b[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27,}\b").unwrap(),
        },
        PatternDef {
            provider: "Discord",
            match_type: "Webhook URL",
            regex: Regex::new(r"https://discord(app)?\.com/api/webhooks/[0-9]+/[a-zA-Z0-9_-]+").unwrap(),
        },

        // Telegram
        PatternDef {
            provider: "Telegram",
            match_type: "Bot Token",
            regex: Regex::new(r"\b[0-9]{8,10}:[a-zA-Z0-9_-]{35}\b").unwrap(),
        },

        // ==========================================
        // 💳 PAYMENTS
        // ==========================================

        // Stripe
        PatternDef {
            provider: "Stripe",
            match_type: "Secret Key",
            regex: Regex::new(r"(?i)\bsk_(?:live|test)_[0-9a-zA-Z]{24,}\b").unwrap(),
        },
        PatternDef {
            provider: "Stripe",
            match_type: "Restricted Key",
            regex: Regex::new(r"(?i)\brk_(?:live|test)_[0-9a-zA-Z]{24,}\b").unwrap(),
        },
        PatternDef {
            provider: "Stripe",
            match_type: "Webhook Secret",
            regex: Regex::new(r"\bwhsec_[a-zA-Z0-9]{32,}\b").unwrap(),
        },

        // Square
        PatternDef {
            provider: "Square",
            match_type: "Access Token",
            regex: Regex::new(r"\bsq0atp-[a-zA-Z0-9\-_]{22}\b").unwrap(),
        },

        // Shopify
        PatternDef {
            provider: "Shopify",
            match_type: "Access Token",
            regex: Regex::new(r"\bshpat_[a-f0-9]{32}\b").unwrap(),
        },

        // ==========================================
        // 📊 MONITORING
        // ==========================================

        // Sentry
        PatternDef {
            provider: "Sentry",
            match_type: "DSN",
            regex: Regex::new(r"https://[a-f0-9]{32}@[a-z0-9]+\.ingest\.sentry\.io/[0-9]+").unwrap(),
        },
        PatternDef {
            provider: "Sentry",
            match_type: "Auth Token",
            regex: Regex::new(r"\bsntrys_[a-zA-Z0-9]{48,}\b").unwrap(),
        },

        // New Relic
        PatternDef {
            provider: "New Relic",
            match_type: "API Key",
            regex: Regex::new(r"\bNRAK-[A-Z0-9]{27}\b").unwrap(),
        },

        // Grafana Cloud
        PatternDef {
            provider: "Grafana",
            match_type: "Cloud Token",
            regex: Regex::new(r"\bglc_[a-zA-Z0-9]{32,}\b").unwrap(),
        },

        // ==========================================
        // 🌐 SOCIAL
        // ==========================================

        // Facebook
        PatternDef {
            provider: "Facebook",
            match_type: "Access Token",
            regex: Regex::new(r"\bEAA[a-zA-Z0-9]{100,}\b").unwrap(),
        },

        // Airtable
        PatternDef {
            provider: "Airtable",
            match_type: "API Key",
            regex: Regex::new(r"\bkey[a-zA-Z0-9]{14}\b").unwrap(),
        },

        // Notion
        PatternDef {
            provider: "Notion",
            match_type: "Integration Token",
            regex: Regex::new(r"\bsecret_[a-zA-Z0-9]{43}\b").unwrap(),
        },

        // Figma
        PatternDef {
            provider: "Figma",
            match_type: "Personal Token",
            regex: Regex::new(r"\bfigd_[a-zA-Z0-9\-_]{40,}\b").unwrap(),
        },

        // ==========================================
        // 🔒 GENERIC (SPECIFIC PREFIXES ONLY)
        // ==========================================

        // Private Keys (PEM format)
        PatternDef {
            provider: "General",
            match_type: "Private Key",
            regex: Regex::new(r"-----BEGIN [A-Z ]+ PRIVATE KEY-----").unwrap(),
        },

        // Password in URL - REMOVED (too broad, matched regular URLs)
        // Will be re-added with stricter validation in Pro+ version
    ];
}
