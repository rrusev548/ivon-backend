import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { stripe, stripeWebhookSecret } from '@/lib/stripe';
import { sendReceiptEmail, type Locale } from '@/lib/email';
import { pick } from '@/lib/locale';

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

      try {
        const [user, course] = await Promise.all([
          prisma.user.findUnique({ where: { id: userId } }),
          prisma.course.findUnique({ where: { id: courseId } }),
        ]);
        if (user && course) {
          const locale = inferLocale(session);
          const amount = formatAmount(session.amount_total ?? 0, session.currency ?? 'eur');
          await sendReceiptEmail({
            to: user.email,
            courseTitle: pick(course, 'title', locale),
            amount,
            locale,
          });
        }
      } catch (err) {
        console.error('[stripe-webhook] receipt email failed:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}

function inferLocale(session: Stripe.Checkout.Session): Locale {
  const raw = session.locale ?? '';
  if (raw.startsWith('bg')) return 'bg';
  if (raw.startsWith('de')) return 'de';
  return 'en';
}

function formatAmount(cents: number, currency: string): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}
