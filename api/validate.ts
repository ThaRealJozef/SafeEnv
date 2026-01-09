import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ valid: false });

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

        if (error || !data?.is_active) {
            return res.status(401).json({ valid: false });
        }

        return res.status(200).json({ valid: true, plan: data.plan });
    } catch {
        return res.status(500).json({ valid: false });
    }
}
