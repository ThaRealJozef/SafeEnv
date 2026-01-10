import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'api' } }
);

function generateApiKey(): string {
    return `sk_${crypto.randomBytes(32).toString('hex')}`;
}

function verifySignature(payload: string, signature: string, secret: string): boolean {
    const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const signature = req.headers['x-signature'] as string;
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const rawBody = JSON.stringify(req.body);
    if (!verifySignature(rawBody, signature, webhookSecret)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    try {
        const event = req.body;
        const eventName = event.meta?.event_name;

        if (eventName === 'order_created') {
            const email = event.data?.attributes?.user_email;

            if (!email) {
                return res.status(400).json({ error: 'Missing email' });
            }

            // Check if license already exists for this email
            const { data: existing } = await supabase
                .from('licenses')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) {
                // Reactivate existing license
                await supabase
                    .from('licenses')
                    .update({ is_active: true, plan: 'pro' })
                    .eq('email', email);
            } else {
                // Create new license
                const apiKey = generateApiKey();
                await supabase.from('licenses').insert({
                    email,
                    api_key: apiKey,
                    plan: 'pro',
                    is_active: true
                });
            }
        }

        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const email = event.data?.attributes?.user_email;
            if (email) {
                await supabase
                    .from('licenses')
                    .update({ is_active: false })
                    .eq('email', email);
            }
        }

        return res.status(200).json({ received: true });
    } catch {
        return res.status(500).json({ error: 'Server error' });
    }
}
