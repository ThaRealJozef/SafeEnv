import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: log if env vars are missing
if (!url || !key) {
    console.error('Missing env vars:', { url: !!url, key: !!key });
}

const supabase = url && key ? createClient(url, key) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ valid: false });

    // Debug: check if supabase client exists
    if (!supabase) {
        console.error('Supabase client not initialized - env vars missing');
        return res.status(500).json({ valid: false, error: 'config' });
    }

    const apiKey = req.headers['x-api-key'];
    if (!apiKey || typeof apiKey !== 'string' || !/^sk_[a-zA-Z0-9_]{20,64}$/.test(apiKey)) {
        return res.status(401).json({ valid: false });
    }

    try {
        const { data, error } = await supabase
            .from('licenses')
            .select('plan, is_active')
            .eq('api_key', apiKey)
            .single();

        // Debug: log query result
        console.log('Query result:', { data, error: error?.message });

        if (error || !data?.is_active) {
            return res.status(401).json({ valid: false });
        }

        return res.status(200).json({ valid: true, plan: data.plan });
    } catch (err) {
        console.error('Catch error:', err);
        return res.status(500).json({ valid: false });
    }
}
