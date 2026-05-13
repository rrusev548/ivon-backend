export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? '';
  const password = rawUrl.match(/:([^@:/]+)@/)?.[1] ?? '';

  const diagnostics = {
    DATABASE_URL_set: rawUrl.length > 0,
    DATABASE_URL_length: rawUrl.length,
    DATABASE_URL_prefix: rawUrl.slice(0, 35),
    DATABASE_URL_suffix: rawUrl.slice(-30),
    DATABASE_URL_has_pgbouncer: rawUrl.includes('pgbouncer=true'),
    DATABASE_URL_host: rawUrl.match(/@([^:/]+)/)?.[1] ?? null,
    DATABASE_URL_port: rawUrl.match(/:(\d+)\//)?.[1] ?? null,
    password_length: password.length,
    password_fingerprint: password
      ? password.slice(0, 3) + '...' + password.slice(-3)
      : null,
    SESSION_PASSWORD_set: !!process.env.SESSION_PASSWORD,
    SESSION_PASSWORD_length: (process.env.SESSION_PASSWORD ?? '').length,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? null,
    SITE_URL: process.env.SITE_URL ?? null,
    LINKTREE_URL: process.env.LINKTREE_URL ?? null,
    EMAIL_FROM: process.env.EMAIL_FROM ?? null,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return Response.json(diagnostics, { status: 200 });
}
