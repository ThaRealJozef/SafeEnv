use std::collections::HashMap;
use crate::scanner::SecretMatch;

pub const ENTROPY_THRESHOLD: f64 = 4.5;
pub const MIN_TOKEN_LENGTH: usize = 12;
pub const MAX_TOKEN_LENGTH: usize = 256;

/// Calculate Shannon Entropy for a given string.
/// Formula: H(X) = -Σ P(xi) * log2(P(xi))
pub fn shannon_entropy(s: &str) -> f64 {
    if s.is_empty() {
        return 0.0;
    }

    let mut freq: HashMap<char, usize> = HashMap::new();
    for c in s.chars() {
        *freq.entry(c).or_insert(0) += 1;
    }

    let len = s.len() as f64;
    freq.values()
        .map(|&count| {
            let p = count as f64 / len;
            -p * p.log2()
        })
        .sum()
}

/// Find high entropy strings that likely represent secrets.
pub fn find_high_entropy_strings(text: &str) -> Vec<SecretMatch> {
    let mut results = Vec::new();

    // Tokenize by common delimiters (space, quotes, =, :)
    for token in text.split(|c: char| c.is_whitespace() || "\"'=:".contains(c)) {
        let len = token.len();
        if len < MIN_TOKEN_LENGTH || len > MAX_TOKEN_LENGTH {
            continue;
        }
        if is_likely_word(token) {
            continue;
        }

        let entropy = shannon_entropy(token);
        if entropy > ENTROPY_THRESHOLD {
            // Find position in original text
            if let Some(start) = text.find(token) {
                results.push(SecretMatch {
                    provider: "Entropy".to_string(),
                    match_type: "High Entropy String".to_string(),
                    value: token.to_string(),
                    start_index: start,
                    end_index: start + len,
                });
            }
        }
    }
    results
}

/// Heuristic to filter out likely dictionary words.
/// Real words have balanced vowel/consonant ratios.
fn is_likely_word(s: &str) -> bool {
    let vowels: Vec<char> = s.chars().filter(|c| "aeiouAEIOU".contains(*c)).collect();
    let consonants = s.len().saturating_sub(vowels.len());
    
    // If ratio is balanced (25%-60% vowels), likely a word
    let ratio = vowels.len() as f64 / s.len() as f64;
    ratio > 0.25 && ratio < 0.6 && consonants > 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_shannon_entropy() {
        assert_eq!(shannon_entropy(""), 0.0);
        assert!(shannon_entropy("aaaaa") < 0.1);
        assert!(shannon_entropy("abcdefgh") > 2.5);
        assert!(shannon_entropy("sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX") > 4.0);
    }

    #[test]
    fn test_is_likely_word() {
        assert!(is_likely_word("hello"));
        assert!(is_likely_word("world"));
        assert!(!is_likely_word("sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX"));
        assert!(!is_likely_word("AKIAIOSFODNN7EXAMPLE"));
    }
}
