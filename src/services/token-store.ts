import type { TokenResponse } from './higgsfield-oauth.js';

interface StoredToken {
  token: TokenResponse;
  expiresAt: number;
}

const tokens = new Map<string, StoredToken>();

export function saveToken(subject: string, token: TokenResponse): void {
  const ttlSeconds = token.expires_in ?? 3600;
  tokens.set(subject, { token, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function getToken(subject: string): TokenResponse | null {
  const stored = tokens.get(subject);
  if (!stored) return null;
  if (stored.expiresAt < Date.now()) {
    tokens.delete(subject);
    return null;
  }
  return stored.token;
}

export function deleteToken(subject: string): void {
  tokens.delete(subject);
}
