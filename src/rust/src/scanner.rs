use serde::Serialize;
use crate::patterns::PATTERNS;
use crate::entropy;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanResult {
    pub is_clean: bool,
    pub matches: Vec<SecretMatch>,
    pub scan_time_ms: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SecretMatch {
    pub provider: String,
    #[serde(rename = "type")]
    pub match_type: String,
    pub value: String,
    pub start_index: usize,
    pub end_index: usize,
}

pub struct Scanner;

/// Pattern definition for regex-based secret detection.
pub struct PatternDef {
    pub provider: &'static str,
    pub match_type: &'static str,
    pub regex: regex::Regex,
}

impl Scanner {
    pub fn new() -> Self {
        Scanner
    }

    pub fn scan(&self, text: &str) -> ScanResult {
        let mut matches = Vec::new();

        // Phase 1: Regex Patterns
        for pattern in PATTERNS.iter() {
            for mat in pattern.regex.find_iter(text) {
                matches.push(SecretMatch {
                    provider: pattern.provider.to_string(),
                    match_type: pattern.match_type.to_string(),
                    value: mat.as_str().to_string(),
                    start_index: mat.start(),
                    end_index: mat.end(),
                });
            }
        }

        // Phase 2: Entropy Detection
        matches.extend(entropy::find_high_entropy_strings(text));

        // Sort by position
        matches.sort_by_key(|m| m.start_index);

        ScanResult {
            is_clean: matches.is_empty(),
            matches,
            scan_time_ms: 0, // WASM doesn't support Instant::now()
        }
    }
}

