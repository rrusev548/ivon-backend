import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type UserSession = {
  userId?: string;
  email?: string;
};

const password = process.env.SESSION_PASSWORD;
if (!password || password.length < 32) {
  throw new Error('SESSION_PASSWORD must be set and at least 32 characters long.');
}

const sessionOptions: SessionOptions = {
  password,
  cookieName: 'ivon_user_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};

export async function getUserSession() {
  const cookieStore = await cookies();
  return getIronSession<UserSession>(cookieStore, sessionOptions);
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getUserSession();
  return session.userId ?? null;
}
