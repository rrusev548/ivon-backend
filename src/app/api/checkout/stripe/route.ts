import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { stripe, siteUrl } from '@/lib/stripe';
import { getCurrentUserId } from '@/lib/userSession';

const Body = z.object({ courseId: z.string().min(1) });

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured. Set STRIPE_SECRET_KEY in .env to enable checkout.',
      },
      { status: 503 },
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } });
  if (!course || !course.published) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    client_reference_id: `${user.id}:${course.id}`,
    line_items: [
      {
        price_data: {
          currency: course.currency.toLowerCase(),
          unit_amount: course.priceCents,
          product_data: {
            name: course.titleEn,
            description: course.shortDescEn,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/courses/${course.slug}`,
    metadata: { userId: user.id, courseId: course.id },
  });

  return NextResponse.json({ url: session.url });
}
