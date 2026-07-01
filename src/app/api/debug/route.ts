import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUILD_MARKER = 'adapter-v2-cachebust';

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? '';
  const password = rawUrl.match(/:([^@:/]+)@/)?.[1] ?? '';

  const modules: Record<string, boolean> = {};
  for (const m of ['@prisma/adapter-pg', 'pg']) {
    try {
      require.resolve(m);
      modules[m] = true;
    } catch {
      modules[m] = false;
    }
  }

  let dbProbe: Record<string, unknown> = { ran: false };
  try {
    const start = Date.now();
    const result = await prisma.$queryRawUnsafe<Array<{ n: number }>>('SELECT 1 as n');
    dbProbe = { ran: true, ok: true, took_ms: Date.now() - start, result };
  } catch (err) {
    const e = err as Error & { code?: string; meta?: unknown };
    dbProbe = {
      ran: true,
      ok: false,
      name: e.name,
      message: e.message,
      code: e.code,
      meta: e.meta,
      stack: e.stack?.split('\n').slice(0, 5).join('\n'),
    };
  }

  const diagnostics = {
    BUILD_MARKER,
    modules,
    DATABASE_URL_set: rawUrl.length > 0,
    DATABASE_URL_host: rawUrl.match(/@([^:/]+)/)?.[1] ?? null,
    DATABASE_URL_port: rawUrl.match(/:(\d+)\//)?.[1] ?? null,
    password_fingerprint: password
      ? password.slice(0, 3) + '...' + password.slice(-3)
      : null,
    NODE_ENV: process.env.NODE_ENV,
    dbProbe,
    timestamp: new Date().toISOString(),
  };

  return Response.json(diagnostics, { status: 200 });
}
