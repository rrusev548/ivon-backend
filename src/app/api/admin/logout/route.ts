import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';

export async function POST(req: Request) {
  const session = await getAdminSession();
  session.destroy();
  return NextResponse.redirect(new URL('/admin/login', req.url), 303);
}
