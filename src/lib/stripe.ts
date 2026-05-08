import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key ? new Stripe(key) : null;

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
export const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
