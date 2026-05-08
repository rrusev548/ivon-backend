import bcrypt from 'bcryptjs';
import { prisma } from './db';

export async function ensureAdminUser(email: string, password: string) {
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.adminUser.create({ data: { email, passwordHash } });
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}
