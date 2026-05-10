import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import Reveal from '@/components/Reveal';

const content: Record<Locale, { intro: string; sections: { title: string; body: string }[] }> = {
  bg: {
    intro:
      'Тази политика обяснява какви лични данни събираме, защо ги обработваме и какви са твоите права. Стремим се към максимална прозрачност и минимум събиране.',
    sections: [
      {
        title: '1. Кой е администраторът',
        body: 'Digital S Team управлява този сайт и обработва личните ти данни в качеството си на администратор по смисъла на GDPR.',
      },
      {
        title: '2. Какви данни събираме',
        body: 'При регистрация: имейл, име, парола (хеширана). При покупка: данни за плащане се обработват директно от Stripe — ние не съхраняваме номера на карти. Технически логове: IP, тип браузър, време на достъп.',
      },
      {
        title: '3. За какво ги ползваме',
        body: 'Изпълнение на договора (достъп до курса), фактуриране, правни задължения, маркетинг с твое съгласие, защита на сайта от злоупотреби.',
      },
      {
        title: '4. Срокове',
        body: 'Профил данни — до закриване на профила. Транзакционни данни — 10 години (счетоводство). Логове — 30 дни.',
      },
      {
        title: '5. Твоите права',
        body: 'Достъп, корекция, изтриване, ограничаване, преносимост, възражение и оплакване пред КЗЛД. Свържи се на support@digitalsteam.ai.',
      },
      {
        title: '6. Бисквитки',
        body: 'Използваме само технически необходими бисквитки за работата на сайта и опционални за анализ — управляваш ги от cookie banner-а.',
      },
    ],
  },
  en: {
    intro:
      'This policy explains what personal data we collect, why we process it, and your rights. We aim for maximum transparency and minimum collection.',
    sections: [
      {
        title: '1. Who is the controller',
        body: 'Digital S Team operates this website and processes your personal data as a data controller under GDPR.',
      },
      {
        title: '2. Data we collect',
        body: 'On signup: email, name, hashed password. On purchase: payment data is processed directly by Stripe — we do not store card numbers. Technical logs: IP, browser type, access time.',
      },
      {
        title: '3. Why we use it',
        body: 'Contract performance (course access), invoicing, legal obligations, marketing with your consent, abuse protection.',
      },
      {
        title: '4. Retention',
        body: 'Account data — until account closure. Transaction data — 10 years (accounting). Logs — 30 days.',
      },
      {
        title: '5. Your rights',
        body: 'Access, rectification, erasure, restriction, portability, objection, complaint to your DPA. Contact support@digitalsteam.ai.',
      },
      {
        title: '6. Cookies',
        body: 'We use only technically necessary cookies plus optional analytics — manage them via the cookie banner.',
      },
    ],
  },
  de: {
    intro:
      'Diese Erklärung beschreibt, welche personenbezogenen Daten wir erheben, warum wir sie verarbeiten und welche Rechte du hast. Wir streben maximale Transparenz und minimale Erhebung an.',
    sections: [
      {
        title: '1. Verantwortlicher',
        body: 'Digital S Team betreibt diese Website und verarbeitet deine personenbezogenen Daten als Verantwortlicher im Sinne der DSGVO.',
      },
      {
        title: '2. Erhobene Daten',
        body: 'Bei Registrierung: E-Mail, Name, gehashtes Passwort. Beim Kauf: Zahlungsdaten werden direkt von Stripe verarbeitet — wir speichern keine Kartennummern. Technische Logs: IP, Browser-Typ, Zugriffszeit.',
      },
      {
        title: '3. Verwendungszweck',
        body: 'Vertragserfüllung (Kurszugriff), Rechnungsstellung, gesetzliche Pflichten, Marketing mit deiner Einwilligung, Missbrauchsschutz.',
      },
      {
        title: '4. Speicherdauer',
        body: 'Kontodaten — bis zur Kontoschließung. Transaktionsdaten — 10 Jahre (Buchhaltung). Logs — 30 Tage.',
      },
      {
        title: '5. Deine Rechte',
        body: 'Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde bei der Aufsichtsbehörde. Kontakt support@digitalsteam.ai.',
      },
      {
        title: '6. Cookies',
        body: 'Wir verwenden nur technisch notwendige Cookies plus optionale Analyse — verwalte sie über das Cookie-Banner.',
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('legal');
  const data = content[locale];
  const updated = new Date().toLocaleDateString(
    locale === 'bg' ? 'bg-BG' : locale === 'de' ? 'de-DE' : 'en-GB',
  );

  return (
    <section className="mx-auto max-w-3xl px-4 pt-20 pb-24 sm:pt-28">
      <Reveal>
        <span className="eyebrow">— legal</span>
        <h1 className="heading-xl mt-5">{t('privacyTitle')}</h1>
        <p className="mt-3 text-xs uppercase tracking-wider text-cream-100/50">
          {t('privacyUpdated')}: {updated}
        </p>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-8 text-cream-100/80">{data.intro}</p>
        <div className="mt-10 space-y-8">
          {data.sections.map((s, i) => (
            <div key={i}>
              <h2 className="heading-md">{s.title}</h2>
              <p className="mt-3 text-cream-100/75">{s.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
