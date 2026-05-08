import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { pick, pickOptional } from '@/lib/locale';
import type { Locale } from '@/lib/i18n';
import SocialButtons from '@/components/SocialButtons';
import AffiliateGrid from '@/components/AffiliateGrid';
import Reveal from '@/components/Reveal';
import { aboutConfig } from '@/content/about';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('about');
  const ht = await getTranslations('home');

  const [affiliates, credentials, testimonials] = await Promise.all([
    prisma.affiliateLink.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.credential.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const member = aboutConfig.members[0];
  const role =
    locale === 'bg' ? member.roleBg : locale === 'de' ? member.roleDe : member.roleEn;
  const bio = locale === 'bg' ? member.bioBg : locale === 'de' ? member.bioDe : member.bioEn;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="hero-mesh absolute inset-0 -z-10 opacity-70" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="heading-xl mt-5">{t('title')}</h1>
            <p className="mt-4 text-cream-100/70">{t('subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <div className="card-glass p-8 sm:p-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="heading-md">{member.name}</h2>
              <span className="eyebrow shrink-0">{role}</span>
            </div>
            <div className="divider-gold mt-4" />
            <p className="mt-6 leading-relaxed text-cream-100/80">{bio}</p>
            <div className="mt-8">
              <SocialButtons
                instagramHandle={member.socials.instagram}
                tiktokHandle={member.socials.tiktok}
                igLabel={t('followIg')}
                tkLabel={t('followTk')}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {credentials.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <div className="border-l border-gold-300/30 pl-5">
                  <div className="serif text-4xl font-medium text-gold-300">
                    {pick(c, 'value', locale)}
                  </div>
                  <div className="mt-1 text-sm text-cream-100/65">
                    {pick(c, 'label', locale)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12">
          <Reveal>
            <span className="eyebrow">{ht('testimonialsEyebrow')}</span>
            <h2 className="heading-lg mt-3">{ht('testimonialsTitle')}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {testimonials.map((tm, i) => (
              <Reveal key={tm.id} delay={i * 100}>
                <figure className="card-glass h-full p-6">
                  <blockquote className="serif text-base leading-relaxed text-cream-50">
                    “{pick(tm, 'quote', locale)}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-cream-100/60">
                    <span className="font-medium text-cream-50">{pick(tm, 'author', locale)}</span>
                    {pickOptional(tm, 'role', locale) && (
                      <span> · {pickOptional(tm, 'role', locale)}</span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {affiliates.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-12 pb-24">
          <Reveal>
            <span className="eyebrow">★</span>
            <h2 className="heading-lg mt-3">{t('affiliateTitle')}</h2>
            <p className="mt-3 text-cream-100/70">{t('affiliateSubtitle')}</p>
          </Reveal>
          <div className="mt-8">
            <AffiliateGrid
              items={affiliates.map((a) => ({
                id: a.id,
                name: pick(a, 'name', locale),
                desc: pick(a, 'desc', locale),
                url: a.url,
              }))}
              openLabel={t('openLink')}
            />
          </div>
        </section>
      )}
    </>
  );
}
