import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!stripe || !stripeWebhookSecret) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, stripeWebhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;
    if (userId && courseId) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: {
          userId,
          courseId,
          source: 'stripe',
          externalId: session.id,
          amountCents: session.amount_total ?? 0,
          currency: (session.currency ?? 'eur').toUpperCase(),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
