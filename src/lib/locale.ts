import type { Locale } from './i18n';

const SUFFIX: Record<Locale, 'Bg' | 'En' | 'De'> = {
  bg: 'Bg',
  en: 'En',
  de: 'De',
};

export function pick<T extends Record<string, unknown>>(
  item: T,
  base: string,
  locale: Locale,
): string {
  const key = `${base}${SUFFIX[locale]}` as keyof T;
  const value = item[key];
  return typeof value === 'string' ? value : '';
}

export function pickOptional<T extends Record<string, unknown>>(
  item: T,
  base: string,
  locale: Locale,
): string | null {
  const key = `${base}${SUFFIX[locale]}` as keyof T;
  const value = item[key];
  return typeof value === 'string' ? value : null;
}
