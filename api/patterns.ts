import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'api' } }
);

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 3600000;

const PRO_PATTERNS = [
    { provider: "Clerk", type: "Secret Key", regex: "sk_live_[a-zA-Z0-9]{24,}" },
    { provider: "Clerk", type: "Publishable Key", regex: "pk_live_[a-zA-Z0-9]{24,}" },
    { provider: "Neon", type: "API Key", regex: "neon_[a-zA-Z0-9]{32,}" },
    { provider: "Turso", type: "Auth Token", regex: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9\\.[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+" },
    { provider: "Upstash", type: "Redis Token", regex: "AX[a-zA-Z0-9]{40,}" },
    { provider: "Railway", type: "API Token", regex: "railway_[a-zA-Z0-9]{32,}" },
    { provider: "Linear", type: "API Key", regex: "lin_api_[a-zA-Z0-9]{40}" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!/^sk_[a-zA-Z0-9_]{20,64}$/.test(apiKey)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: license, error } = await supabase
            .from('licenses')
            .select('id, plan, is_active, sync_count')
            .eq('api_key', apiKey)
            .single();

        if (error || !license || !license.is_active) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const cutoff = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
        const { count } = await supabase
            .from('rate_limits')
            .select('*', { count: 'exact', head: true })
            .eq('api_key', apiKey)
            .gte('synced_at', cutoff);

        if ((count || 0) >= RATE_LIMIT) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }

        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || '';
        await supabase.from('rate_limits').insert({ api_key: apiKey, ip_address: ip.slice(0, 45) });

        await supabase
            .from('licenses')
            .update({ sync_count: (license.sync_count || 0) + 1, last_sync: new Date().toISOString() })
            .eq('id', license.id);

        return res.status(200).json({ patterns: PRO_PATTERNS });
    } catch {
        return res.status(500).json({ error: 'Server error' });
    }
}
