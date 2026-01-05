use regex::Regex;
use lazy_static::lazy_static;
use crate::scanner::PatternDef;

lazy_static! {
    pub static ref PATTERNS: Vec<PatternDef> = vec![
        // ==========================================
        // 🤖 ARTIFICIAL INTELLIGENCE
        // ==========================================

        // OpenAI (ChatGPT)
        PatternDef {
            provider: "OpenAI",
            match_type: "Legacy API Key",
            regex: Regex::new(r"\bsk-[a-zA-Z0-9]{48}\b").unwrap(),
        },
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
            regex: Regex::new(r"\bpplx-[a-zA-Z0-9]{30,}\b").unwrap(),
        },

        // xAI (Grok)
        PatternDef {
            provider: "xAI (Grok)",
            match_type: "API Key",
            regex: Regex::new(r"\bxai-[a-zA-Z0-9]{20,}\b").unwrap(),
        },

        // Groq (Fast Inference)
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

        // Cohere
        PatternDef {
            provider: "Cohere",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-zA-Z0-9]{40}\b").unwrap(), // Generic, may need tuning
        },

        // Together AI
        PatternDef {
            provider: "Together AI",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{64}\b").unwrap(),
        },

        // Stability AI
        PatternDef {
            provider: "Stability AI",
            match_type: "API Key",
            regex: Regex::new(r"\bsk-[a-zA-Z0-9]{48}\b").unwrap(),
        },

        // Mistral AI
        PatternDef {
            provider: "Mistral AI",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-zA-Z0-9]{32}\b").unwrap(),
        },

        // DeepSeek
        PatternDef {
            provider: "DeepSeek",
            match_type: "API Key",
            regex: Regex::new(r"\bsk-[a-zA-Z0-9]{32,}\b").unwrap(),
        },

        // Generic AI sk- catch-all
        PatternDef {
            provider: "General AI",
            match_type: "API Key (sk-)",
            regex: Regex::new(r"\bsk-[a-zA-Z0-9]{32,}\b").unwrap(),
        },

        // ==========================================
        // ☁️ CLOUD PROVIDERS
        // ==========================================

        // AWS
        PatternDef {
            provider: "AWS",
            match_type: "Access Key ID",
            regex: Regex::new(r"(?i)\b(AKIA|ASIA|ABIA|ACCA)[0-9A-Z]{16}\b").unwrap(),
        },
        PatternDef {
            provider: "AWS",
            match_type: "Secret Access Key",
            regex: Regex::new(r#"(?i)aws.{0,20}['"][0-9a-zA-Z/+]{40}['"]"#).unwrap(),
        },
        PatternDef {
            provider: "AWS",
            match_type: "Session Token",
            regex: Regex::new(r"\bFwoGZXIvYXdzE[a-zA-Z0-9/+=]{100,}\b").unwrap(),
        },

        // Google Cloud
        PatternDef {
            provider: "Google",
            match_type: "API Key",
            regex: Regex::new(r"\bAIza[0-9A-Za-z\-_]{35}\b").unwrap(),
        },
        PatternDef {
            provider: "Google",
            match_type: "OAuth Token",
            regex: Regex::new(r"\bya29\.[0-9A-Za-z\-_]{20,}\b").unwrap(),
        },
        PatternDef {
            provider: "Google",
            match_type: "Service Account",
            regex: Regex::new(r#""type":\s*"service_account""#).unwrap(),
        },
        PatternDef {
            provider: "Google",
            match_type: "OAuth Client Secret",
            regex: Regex::new(r#""client_secret":\s*"[a-zA-Z0-9\-_]{24}""#).unwrap(),
        },

        // Azure
        PatternDef {
            provider: "Azure",
            match_type: "Storage Account Key",
            regex: Regex::new(r"\b[a-zA-Z0-9+/]{86}==\b").unwrap(),
        },
        PatternDef {
            provider: "Azure",
            match_type: "Connection String",
            regex: Regex::new(r"DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+").unwrap(),
        },
        PatternDef {
            provider: "Azure",
            match_type: "SAS Token",
            regex: Regex::new(r"\bsig=[a-zA-Z0-9%]{43,}(&|$)").unwrap(),
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
        PatternDef {
            provider: "DigitalOcean",
            match_type: "OAuth Token",
            regex: Regex::new(r"\bdoo_v1_[a-f0-9]{64}\b").unwrap(),
        },
        PatternDef {
            provider: "DigitalOcean",
            match_type: "Refresh Token",
            regex: Regex::new(r"\bdor_v1_[a-f0-9]{64}\b").unwrap(),
        },

        // Cloudflare
        PatternDef {
            provider: "Cloudflare",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{37}\b").unwrap(),
        },
        PatternDef {
            provider: "Cloudflare",
            match_type: "API Token",
            regex: Regex::new(r"\b[A-Za-z0-9_-]{40}\b").unwrap(),
        },

        // Vercel
        PatternDef {
            provider: "Vercel",
            match_type: "API Token",
            regex: Regex::new(r"\bvercel_[a-zA-Z0-9]{24}\b").unwrap(),
        },

        // Netlify
        PatternDef {
            provider: "Netlify",
            match_type: "Personal Access Token",
            regex: Regex::new(r"\b[a-zA-Z0-9_-]{40,}\b").unwrap(), // Netlify tokens are generic
        },

        // Heroku
        PatternDef {
            provider: "Heroku",
            match_type: "API Key",
            regex: Regex::new(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b").unwrap(),
        },

        // Supabase
        PatternDef {
            provider: "Supabase",
            match_type: "Service Key",
            regex: Regex::new(r"\bsbp_[a-f0-9]{40}\b").unwrap(),
        },
        PatternDef {
            provider: "Supabase",
            match_type: "JWT Secret",
            regex: Regex::new(r"\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b").unwrap(),
        },

        // Firebase
        PatternDef {
            provider: "Firebase",
            match_type: "API Key",
            regex: Regex::new(r"\bAIza[0-9A-Za-z\-_]{35}\b").unwrap(),
        },
        PatternDef {
            provider: "Firebase",
            match_type: "Database URL",
            regex: Regex::new(r"https://[a-z0-9-]+\.firebaseio\.com").unwrap(),
        },

        // PlanetScale
        PatternDef {
            provider: "PlanetScale",
            match_type: "Service Token",
            regex: Regex::new(r"\bpscale_tkn_[a-zA-Z0-9_]{43}\b").unwrap(),
        },
        PatternDef {
            provider: "PlanetScale",
            match_type: "OAuth Token",
            regex: Regex::new(r"\bpscale_oauth_[a-zA-Z0-9_]{43}\b").unwrap(),
        },

        // Railway
        PatternDef {
            provider: "Railway",
            match_type: "API Token",
            regex: Regex::new(r"\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b").unwrap(),
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
            regex: Regex::new(r"\bfo1_[a-zA-Z0-9_-]{43}\b").unwrap(),
        },

        // ==========================================
        // 🗄️ DATABASES
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
        PatternDef {
            provider: "Redis",
            match_type: "Redis Labs",
            regex: Regex::new(r"rediss?://[^:]+:[^@]+@[^\s]+").unwrap(),
        },

        // Elasticsearch
        PatternDef {
            provider: "Elasticsearch",
            match_type: "Connection String",
            regex: Regex::new(r"https?://[^:]+:[^@]+@[^\s]*elastic[^\s]*").unwrap(),
        },

        // CockroachDB
        PatternDef {
            provider: "CockroachDB",
            match_type: "Connection String",
            regex: Regex::new(r"postgresql://[^:]+:[^@]+@[^\s]*cockroach[^\s]*").unwrap(),
        },

        // ==========================================
        // 🛠️ DEVOPS & VERSION CONTROL
        // ==========================================

        // GitHub
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
        PatternDef {
            provider: "GitHub",
            match_type: "User-to-Server Token",
            regex: Regex::new(r"\bghu_[a-zA-Z0-9]{36}\b").unwrap(),
        },
        PatternDef {
            provider: "GitHub",
            match_type: "Server-to-Server Token",
            regex: Regex::new(r"\bghs_[a-zA-Z0-9]{36}\b").unwrap(),
        },
        PatternDef {
            provider: "GitHub",
            match_type: "Refresh Token",
            regex: Regex::new(r"\bghr_[a-zA-Z0-9]{36}\b").unwrap(),
        },

        // GitLab
        PatternDef {
            provider: "GitLab",
            match_type: "Personal Access Token",
            regex: Regex::new(r"\bglpat-[0-9a-zA-Z\-_]{20}\b").unwrap(),
        },
        PatternDef {
            provider: "GitLab",
            match_type: "Pipeline Token",
            regex: Regex::new(r"\bglptt-[0-9a-zA-Z\-_]{20}\b").unwrap(),
        },
        PatternDef {
            provider: "GitLab",
            match_type: "Runner Token",
            regex: Regex::new(r"\bGR1348941[0-9a-zA-Z\-_]{20}\b").unwrap(),
        },

        // Bitbucket
        PatternDef {
            provider: "Bitbucket",
            match_type: "App Password",
            regex: Regex::new(r"\b[a-zA-Z0-9]{56}\b").unwrap(),
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

        // CircleCI
        PatternDef {
            provider: "CircleCI",
            match_type: "Personal Token",
            regex: Regex::new(r"\b[a-f0-9]{40}\b").unwrap(),
        },

        // Travis CI
        PatternDef {
            provider: "Travis CI",
            match_type: "Access Token",
            regex: Regex::new(r"\b[a-zA-Z0-9]{22}\b").unwrap(),
        },

        // Jenkins
        PatternDef {
            provider: "Jenkins",
            match_type: "API Token",
            regex: Regex::new(r"\b[a-f0-9]{32,34}\b").unwrap(),
        },

        // SonarQube
        PatternDef {
            provider: "SonarQube",
            match_type: "Token",
            regex: Regex::new(r"\bsqu_[a-f0-9]{40}\b").unwrap(),
        },

        // ==========================================
        // 📧 COMMUNICATION & EMAIL
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

        // Postmark
        PatternDef {
            provider: "Postmark",
            match_type: "Server Token",
            regex: Regex::new(r"\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b").unwrap(),
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
        PatternDef {
            provider: "Twilio",
            match_type: "Auth Token",
            regex: Regex::new(r"\bSK[a-f0-9]{32}\b").unwrap(),
        },

        // Vonage (Nexmo)
        PatternDef {
            provider: "Vonage",
            match_type: "API Secret",
            regex: Regex::new(r"\b[a-zA-Z0-9]{16}\b").unwrap(),
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
            match_type: "App Token",
            regex: Regex::new(r"\bxapp-[0-9]{1}-[A-Z0-9]{10,11}-[0-9]{12,13}-[a-f0-9]{64}\b").unwrap(),
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

        // Microsoft Teams
        PatternDef {
            provider: "Microsoft Teams",
            match_type: "Webhook URL",
            regex: Regex::new(r"https://[a-z0-9]+\.webhook\.office\.com/webhookb2/[a-f0-9-]+").unwrap(),
        },

        // Intercom
        PatternDef {
            provider: "Intercom",
            match_type: "Access Token",
            regex: Regex::new(r"\b[a-z0-9=_\-]{60}\b").unwrap(),
        },

        // Zendesk
        PatternDef {
            provider: "Zendesk",
            match_type: "API Token",
            regex: Regex::new(r"\b[a-zA-Z0-9]{40}\b").unwrap(),
        },

        // ==========================================
        // 💳 PAYMENT & FINTECH
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

        // PayPal
        PatternDef {
            provider: "PayPal",
            match_type: "Client ID",
            regex: Regex::new(r"\bA[a-zA-Z0-9_-]{79}\b").unwrap(),
        },
        PatternDef {
            provider: "PayPal",
            match_type: "OAuth Token",
            regex: Regex::new(r"\baccess_token\$[a-zA-Z0-9]{100,}\b").unwrap(),
        },

        // Square
        PatternDef {
            provider: "Square",
            match_type: "Access Token",
            regex: Regex::new(r"\bsq0atp-[a-zA-Z0-9\-_]{22}\b").unwrap(),
        },
        PatternDef {
            provider: "Square",
            match_type: "OAuth Secret",
            regex: Regex::new(r"\bsq0csp-[a-zA-Z0-9\-_]{43}\b").unwrap(),
        },

        // Plaid
        PatternDef {
            provider: "Plaid",
            match_type: "Client ID",
            regex: Regex::new(r"\b[a-f0-9]{24}\b").unwrap(),
        },
        PatternDef {
            provider: "Plaid",
            match_type: "Secret",
            regex: Regex::new(r"\b[a-f0-9]{30}\b").unwrap(),
        },

        // Braintree
        PatternDef {
            provider: "Braintree",
            match_type: "Access Token",
            regex: Regex::new(r"\baccess_token\$production\$[a-z0-9]{16}\$[a-f0-9]{32}\b").unwrap(),
        },

        // Shopify
        PatternDef {
            provider: "Shopify",
            match_type: "Private App Token",
            regex: Regex::new(r"\bshppa_[a-f0-9]{32}\b").unwrap(),
        },
        PatternDef {
            provider: "Shopify",
            match_type: "Access Token",
            regex: Regex::new(r"\bshpat_[a-f0-9]{32}\b").unwrap(),
        },
        PatternDef {
            provider: "Shopify",
            match_type: "Shared Secret",
            regex: Regex::new(r"\bshpss_[a-f0-9]{32}\b").unwrap(),
        },

        // Coinbase
        PatternDef {
            provider: "Coinbase",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-z0-9]{16,}\b").unwrap(),
        },

        // ==========================================
        // 📊 ANALYTICS & MONITORING
        // ==========================================

        // Datadog
        PatternDef {
            provider: "Datadog",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{32}\b").unwrap(),
        },
        PatternDef {
            provider: "Datadog",
            match_type: "App Key",
            regex: Regex::new(r"\b[a-f0-9]{40}\b").unwrap(),
        },

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
            match_type: "License Key",
            regex: Regex::new(r"\b[a-f0-9]{40}NRAL\b").unwrap(),
        },
        PatternDef {
            provider: "New Relic",
            match_type: "API Key",
            regex: Regex::new(r"\bNRAK-[A-Z0-9]{27}\b").unwrap(),
        },

        // Segment
        PatternDef {
            provider: "Segment",
            match_type: "Write Key",
            regex: Regex::new(r"\b[a-zA-Z0-9]{32}\b").unwrap(),
        },

        // Amplitude
        PatternDef {
            provider: "Amplitude",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{32}\b").unwrap(),
        },

        // Mixpanel
        PatternDef {
            provider: "Mixpanel",
            match_type: "Token",
            regex: Regex::new(r"\b[a-f0-9]{32}\b").unwrap(),
        },

        // LogRocket
        PatternDef {
            provider: "LogRocket",
            match_type: "App ID",
            regex: Regex::new(r"\b[a-z0-9]{6}/[a-z0-9-]+\b").unwrap(),
        },

        // Grafana
        PatternDef {
            provider: "Grafana",
            match_type: "API Key",
            regex: Regex::new(r"\beyJr[a-zA-Z0-9]{50,}\b").unwrap(),
        },
        PatternDef {
            provider: "Grafana",
            match_type: "Cloud Token",
            regex: Regex::new(r"\bglc_[a-zA-Z0-9]{32,}\b").unwrap(),
        },
        PatternDef {
            provider: "Grafana",
            match_type: "Service Account",
            regex: Regex::new(r"\bglsa_[a-zA-Z0-9]{32,}\b").unwrap(),
        },

        // PagerDuty
        PatternDef {
            provider: "PagerDuty",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-zA-Z0-9+]{20}\b").unwrap(),
        },

        // Honeycomb
        PatternDef {
            provider: "Honeycomb",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-f0-9]{32}\b").unwrap(),
        },

        // ==========================================
        // 🌐 SOCIAL & MARKETING
        // ==========================================

        // Facebook / Meta
        PatternDef {
            provider: "Facebook",
            match_type: "Access Token",
            regex: Regex::new(r"\bEAA[a-zA-Z0-9]{100,}\b").unwrap(),
        },

        // Twitter / X
        PatternDef {
            provider: "Twitter/X",
            match_type: "Bearer Token",
            regex: Regex::new(r"\bAAAAAAAAAAAAAAAAAAAAA[a-zA-Z0-9%]{50,}\b").unwrap(),
        },
        PatternDef {
            provider: "Twitter/X",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-zA-Z0-9]{25}\b").unwrap(),
        },

        // LinkedIn
        PatternDef {
            provider: "LinkedIn",
            match_type: "Access Token",
            regex: Regex::new(r"\bAQV[a-zA-Z0-9\-_]{50,}\b").unwrap(),
        },

        // Instagram
        PatternDef {
            provider: "Instagram",
            match_type: "Access Token",
            regex: Regex::new(r"\bIGQV[a-zA-Z0-9\-_]{100,}\b").unwrap(),
        },

        // YouTube
        PatternDef {
            provider: "YouTube",
            match_type: "API Key",
            regex: Regex::new(r"\bAIza[0-9A-Za-z\-_]{35}\b").unwrap(),
        },

        // Airtable
        PatternDef {
            provider: "Airtable",
            match_type: "API Key",
            regex: Regex::new(r"\bkey[a-zA-Z0-9]{14}\b").unwrap(),
        },
        PatternDef {
            provider: "Airtable",
            match_type: "Personal Token",
            regex: Regex::new(r"\bpat[a-zA-Z0-9]{14}\.[a-f0-9]{64}\b").unwrap(),
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

        // Asana
        PatternDef {
            provider: "Asana",
            match_type: "Personal Token",
            regex: Regex::new(r"\b[0-9]/[0-9]{16}:[a-f0-9]{32}\b").unwrap(),
        },

        // ==========================================
        // 🗺️ MAPS & LOCATION
        // ==========================================

        // Mapbox
        PatternDef {
            provider: "Mapbox",
            match_type: "Public Token",
            regex: Regex::new(r"\bpk\.[a-zA-Z0-9]{60,}\.[a-zA-Z0-9]{20,}\b").unwrap(),
        },
        PatternDef {
            provider: "Mapbox",
            match_type: "Secret Token",
            regex: Regex::new(r"\bsk\.[a-zA-Z0-9]{60,}\.[a-zA-Z0-9]{20,}\b").unwrap(),
        },

        // HERE
        PatternDef {
            provider: "HERE",
            match_type: "API Key",
            regex: Regex::new(r"\b[a-zA-Z0-9_-]{43}\b").unwrap(),
        },

        // ==========================================
        // 🔐 AUTH & IDENTITY
        // ==========================================

        // Auth0
        PatternDef {
            provider: "Auth0",
            match_type: "API Token",
            regex: Regex::new(r"\beyJ[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+\b").unwrap(),
        },

        // Okta
        PatternDef {
            provider: "Okta",
            match_type: "API Token",
            regex: Regex::new(r"\b00[a-zA-Z0-9\-_]{40}\b").unwrap(),
        },

        // Clerk
        PatternDef {
            provider: "Clerk",
            match_type: "Secret Key",
            regex: Regex::new(r"\bsk_(?:live|test)_[a-zA-Z0-9]{24,}\b").unwrap(),
        },

        // ==========================================
        // 🔒 GENERIC SECRETS
        // ==========================================

        // Private Keys (PEM)
        PatternDef {
            provider: "General",
            match_type: "Private Key (RSA)",
            regex: Regex::new(r"-----BEGIN RSA PRIVATE KEY-----").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Private Key (DSA)",
            regex: Regex::new(r"-----BEGIN DSA PRIVATE KEY-----").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Private Key (EC)",
            regex: Regex::new(r"-----BEGIN EC PRIVATE KEY-----").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Private Key (OpenSSH)",
            regex: Regex::new(r"-----BEGIN OPENSSH PRIVATE KEY-----").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Private Key (PGP)",
            regex: Regex::new(r"-----BEGIN PGP PRIVATE KEY BLOCK-----").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Private Key (Generic)",
            regex: Regex::new(r"-----BEGIN [A-Z ]+ PRIVATE KEY-----").unwrap(),
        },

        // JWT Tokens
        PatternDef {
            provider: "General",
            match_type: "JWT Token",
            regex: Regex::new(r"\beyJ[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\b").unwrap(),
        },

        // Password in URL
        PatternDef {
            provider: "General",
            match_type: "Password in URL",
            regex: Regex::new(r"[a-z]+://[^:]+:[^@]+@[^\s]+").unwrap(),
        },

        // Basic Auth Header
        PatternDef {
            provider: "General",
            match_type: "Basic Auth Header",
            regex: Regex::new(r"(?i)Authorization:\s*Basic\s+[a-zA-Z0-9+/=]{20,}").unwrap(),
        },
        PatternDef {
            provider: "General",
            match_type: "Bearer Token Header",
            regex: Regex::new(r"(?i)Authorization:\s*Bearer\s+[a-zA-Z0-9\-_\.]{20,}").unwrap(),
        },

        // SSH Keys
        PatternDef {
            provider: "General",
            match_type: "SSH Private Key",
            regex: Regex::new(r"-----BEGIN OPENSSH PRIVATE KEY-----").unwrap(),
        },

        // API Key in query string
        PatternDef {
            provider: "General",
            match_type: "API Key in URL",
            regex: Regex::new(r"(?i)[?&](api_?key|apikey|key|token|secret|password|auth)=[a-zA-Z0-9\-_]{16,}").unwrap(),
        },

        // Hardcoded password patterns
        PatternDef {
            provider: "General",
            match_type: "Hardcoded Password",
            regex: Regex::new(r#"(?i)(password|passwd|pwd|secret)\s*[=:]\s*['""][^'""]{8,}['""]"#).unwrap(),
        },

        // UUID (commonly used for secrets)
        PatternDef {
            provider: "General",
            match_type: "UUID Secret",
            regex: Regex::new(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b").unwrap(),
        },

        // Hex strings (potential secrets)
        PatternDef {
            provider: "General",
            match_type: "Hex Secret (64 char)",
            regex: Regex::new(r"\b[a-f0-9]{64}\b").unwrap(),
        },

        // Base64 encoded secrets (longer than typical)
        PatternDef {
            provider: "General",
            match_type: "Base64 Secret",
            regex: Regex::new(r"\b[A-Za-z0-9+/]{40,}={0,2}\b").unwrap(),
        },
    ];
}
