import type { Tool, Prompt } from '@prisma/client';
import type { Locale } from './i18n';

export function pickToolFields(tool: Tool, locale: Locale) {
  return {
    id: tool.id,
    slug: tool.slug,
    name: locale === 'bg' ? tool.nameBg : tool.nameEn,
    tagline: locale === 'bg' ? tool.taglineBg : tool.taglineEn,
    description: locale === 'bg' ? tool.descriptionBg : tool.descriptionEn,
    iconUrl: tool.iconUrl,
    affiliateUrl: tool.affiliateUrl,
    category: tool.category,
    featured: tool.featured,
  };
}

export function pickPromptFields(prompt: Prompt, locale: Locale) {
  return {
    id: prompt.id,
    title: locale === 'bg' ? prompt.titleBg : prompt.titleEn,
    content: locale === 'bg' ? prompt.contentBg : prompt.contentEn,
  };
}
