import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const rawUrl = process.env.DATABASE_URL ?? '';
const urlPrefix = rawUrl.slice(0, 25);
const urlSuffix = rawUrl.length > 25 ? rawUrl.slice(-25) : '';
const passwordSection = rawUrl.match(/:([^@:/]+)@/)?.[1] ?? '';
console.log(
  '[db] DATABASE_URL diagnostics — length:',
  rawUrl.length,
  '| prefix:',
  urlPrefix,
  '| suffix:',
  urlSuffix,
  '| password length:',
  passwordSection.length,
  '| password fingerprint:',
  passwordSection.slice(0, 3) + '...' + passwordSection.slice(-3),
);

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
