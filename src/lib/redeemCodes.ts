import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCode(): string {
  const buf = randomBytes(12);
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += ALPHABET[buf[i]! % ALPHABET.length];
    if (i === 3 || i === 7) out += '-';
  }
  return out;
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}
