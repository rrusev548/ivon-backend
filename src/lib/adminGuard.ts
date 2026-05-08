import { NextResponse } from 'next/server';
import { getAdminSession } from './session';

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session.userId) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  return null;
}
