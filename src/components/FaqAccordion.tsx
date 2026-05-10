'use client';

import { useState } from 'react';
import { courseFaq } from '@/content/faq';
import type { Locale } from '@/lib/i18n';

const pickFaq = (item: (typeof courseFaq)[number], locale: Locale) => {
  if (locale === 'en') return { q: item.qEn, a: item.aEn };
  if (locale === 'de') return { q: item.qDe, a: item.aDe };
  return { q: item.qBg, a: item.aBg };
};

export default function FaqAccordion({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {courseFaq.map((item, i) => {
        const { q, a } = pickFaq(item, locale);
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`card-glass overflow-hidden transition-colors ${
              isOpen ? 'border-gold-300/30' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-cream-50">{q}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-300/40 text-gold-300 transition-transform ${
                  isOpen ? 'rotate-45' : ''
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-cream-100/75">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
