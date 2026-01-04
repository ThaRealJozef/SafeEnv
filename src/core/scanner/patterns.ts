export interface PatternDefinition {
    provider: string;
    type: string;
    regex: RegExp;
}

/**
 * The "Big Three" secret patterns for Phase 1.
 * These utilize character boundaries and specific prefixes to ensure
 * high precision and minimal false positives.
 */
export const BIG_THREE_PATTERNS: PatternDefinition[] = [
    {
        provider: 'AWS',
        type: 'Access Key ID',
        // Matches AKIA, ASIA, etc. followed by 16 uppercase alpha-numeric characters.
        regex: /\b(AKIA|ASIA|ABIA|ACCA)[0-9A-Z]{16}\b/g,
    },
    {
        provider: 'Stripe',
        type: 'Live Secret Key',
        // Matches Stripe live secret keys starting with sk_live_ and followed by 24+ characters.
        regex: /\bsk_live_[0-9a-zA-Z]{24,}\b/g,
    },
    {
        provider: 'OpenAI',
        type: 'API Key',
        // Matches OpenAI keys starting with sk- and followed by 40+ characters.
        regex: /\bsk-[a-zA-Z0-9]{40,}\b/g,
    },
];
