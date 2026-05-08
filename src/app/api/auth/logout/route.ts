import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userSession';

export async function POST() {
  const session = await getUserSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
