import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['bg', 'en'] as const;
export const defaultLocale = 'bg' as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (locales as readonly string[]).includes(requested)
      ? requested
      : defaultLocale;

  if (!(locales as readonly string[]).includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
