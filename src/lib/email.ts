import { Resend } from 'resend';
import { randomBytes } from 'node:crypto';

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';
const resend = apiKey ? new Resend(apiKey) : null;

export type Locale = 'bg' | 'en' | 'de';

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  if (!resend) {
    console.log('\n[email:dev] would send to', to);
    console.log('[email:dev] subject:', subject);
    console.log('[email:dev] body:', html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log();
    return;
  }
  const { error } = await resend.emails.send({ from: fromAddress, to, subject, html });
  if (error) {
    console.error('[email] resend error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export function generateVerificationToken(): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, expiresAt };
}

const SUBJECT_VERIFY: Record<Locale, string> = {
  bg: 'Потвърди имейла си',
  en: 'Verify your email',
  de: 'Bestätige deine E-Mail',
};

const COPY_VERIFY: Record<Locale, { intro: string; cta: string; ignore: string }> = {
  bg: {
    intro: 'Благодарим, че се регистрира. За да активираш профила си, потвърди имейл адреса си:',
    cta: 'Потвърди имейла',
    ignore: 'Ако не си се регистрирал, можеш да игнорираш този имейл.',
  },
  en: {
    intro: 'Thanks for signing up. To activate your account, please verify your email address:',
    cta: 'Verify email',
    ignore: 'If you did not sign up, you can safely ignore this email.',
  },
  de: {
    intro: 'Danke für deine Registrierung. Um dein Konto zu aktivieren, bestätige bitte deine E-Mail-Adresse:',
    cta: 'E-Mail bestätigen',
    ignore: 'Falls du dich nicht registriert hast, kannst du diese E-Mail ignorieren.',
  },
};

export async function sendVerificationEmail(args: { to: string; token: string; locale: Locale }) {
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
  const link = `${siteUrl}/${args.locale}/auth/verify-email?token=${args.token}`;
  const copy = COPY_VERIFY[args.locale];
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;">
      <h1 style="font-size:22px;margin:0 0 16px;">${SUBJECT_VERIFY[args.locale]}</h1>
      <p style="font-size:14px;line-height:1.6;color:#334155;">${copy.intro}</p>
      <p style="margin:24px 0;">
        <a href="${link}" style="background:#3b82f6;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${copy.cta}</a>
      </p>
      <p style="font-size:12px;color:#64748b;word-break:break-all;">${link}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="font-size:12px;color:#64748b;">${copy.ignore}</p>
    </div>
  `;
  await sendEmail({ to: args.to, subject: SUBJECT_VERIFY[args.locale], html });
}

const SUBJECT_RECEIPT: Record<Locale, string> = {
  bg: 'Благодарим за покупката',
  en: 'Thanks for your purchase',
  de: 'Vielen Dank für deinen Kauf',
};

const COPY_RECEIPT: Record<Locale, { intro: (course: string) => string; cta: string; total: string }> = {
  bg: {
    intro: (course) => `Покупката ти на курс „${course}" е успешна. Достъпът е активиран в профила ти.`,
    cta: 'Към профила',
    total: 'Платена сума',
  },
  en: {
    intro: (course) => `Your purchase of "${course}" was successful. Access is now available in your account.`,
    cta: 'Go to account',
    total: 'Amount paid',
  },
  de: {
    intro: (course) => `Dein Kauf von „${course}" war erfolgreich. Der Zugriff ist in deinem Konto verfügbar.`,
    cta: 'Zum Konto',
    total: 'Bezahlter Betrag',
  },
};

export async function sendReceiptEmail(args: {
  to: string;
  courseTitle: string;
  amount: string;
  locale: Locale;
}) {
  const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
  const accountUrl = `${siteUrl}/${args.locale}/account`;
  const copy = COPY_RECEIPT[args.locale];
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;">
      <h1 style="font-size:22px;margin:0 0 16px;">${SUBJECT_RECEIPT[args.locale]}</h1>
      <p style="font-size:14px;line-height:1.6;color:#334155;">${copy.intro(args.courseTitle)}</p>
      <p style="font-size:14px;color:#475569;"><strong>${copy.total}:</strong> ${args.amount}</p>
      <p style="margin:24px 0;">
        <a href="${accountUrl}" style="background:#3b82f6;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${copy.cta}</a>
      </p>
    </div>
  `;
  await sendEmail({ to: args.to, subject: SUBJECT_RECEIPT[args.locale], html });
}
