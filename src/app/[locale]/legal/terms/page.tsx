import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n';
import Reveal from '@/components/Reveal';

const content: Record<Locale, { intro: string; sections: { title: string; body: string }[] }> = {
  bg: {
    intro:
      'Тези условия уреждат отношенията между Digital S Team и потребителите на платформата. Запознай се преди да направиш покупка.',
    sections: [
      {
        title: '1. Предмет',
        body: 'Digital S Team предоставя онлайн обучителни програми (курсове) под формата на видео съдържание, PDF материали и шаблони, достъпни през личен профил.',
      },
      {
        title: '2. Регистрация и профил',
        body: 'За достъп до закупен курс е необходим личен профил. Отговаряш за поверителността на данните си за вход. Не споделяй достъпа с трети лица.',
      },
      {
        title: '3. Цени и плащане',
        body: 'Цените на курсовете са посочени в съответната валута. Плащанията се обработват сигурно през Stripe. Достъпът се отключва автоматично след успешно плащане.',
      },
      {
        title: '4. Гаранция и връщане',
        body: '30-дневна гаранция за връщане на парите от датата на покупка. Връщането на сумата се извършва без въпроси при заявка на support@digitalsteam.ai.',
      },
      {
        title: '5. Авторски права',
        body: 'Цялото съдържание (видео, PDF, шаблони) е защитено от авторско право и се предоставя само за лична употреба. Препродажба, споделяне или публично разпространение са забранени.',
      },
      {
        title: '6. Отговорност',
        body: 'Курсовете дават знания и инструменти. Постигнатите резултати зависят от индивидуалното прилагане. Не гарантираме конкретни приходи или резултати.',
      },
      {
        title: '7. Промени',
        body: 'Запазваме правото да актуализираме условията. Промените влизат в сила от датата на публикуване.',
      },
      {
        title: '8. Контакт',
        body: 'support@digitalsteam.ai · Digital S Team',
      },
    ],
  },
  en: {
    intro:
      'These terms govern the relationship between Digital S Team and users of the platform. Please review before making a purchase.',
    sections: [
      {
        title: '1. Subject',
        body: 'Digital S Team provides online training programs (courses) consisting of video content, PDF materials, and templates, accessible through a personal account.',
      },
      {
        title: '2. Registration and account',
        body: 'A personal account is required to access purchased courses. You are responsible for keeping your login details private. Do not share access with third parties.',
      },
      {
        title: '3. Pricing and payment',
        body: 'Course prices are listed in the relevant currency. Payments are processed securely via Stripe. Access unlocks automatically after successful payment.',
      },
      {
        title: '4. Guarantee and refunds',
        body: '30-day money-back guarantee from the purchase date. Refunds are processed without questions upon request to support@digitalsteam.ai.',
      },
      {
        title: '5. Copyright',
        body: 'All content (video, PDF, templates) is copyright protected and provided for personal use only. Reselling, sharing, or public distribution is prohibited.',
      },
      {
        title: '6. Liability',
        body: 'Courses provide knowledge and tools. Results depend on individual application. We do not guarantee specific income or outcomes.',
      },
      {
        title: '7. Changes',
        body: 'We reserve the right to update these terms. Changes take effect from the date of publication.',
      },
      {
        title: '8. Contact',
        body: 'support@digitalsteam.ai · Digital S Team',
      },
    ],
  },
  de: {
    intro:
      'Diese Bedingungen regeln das Verhältnis zwischen Digital S Team und den Nutzern der Plattform. Bitte lies sie vor einem Kauf.',
    sections: [
      {
        title: '1. Gegenstand',
        body: 'Digital S Team bietet Online-Trainingsprogramme (Kurse) in Form von Videoinhalten, PDF-Materialien und Vorlagen, zugänglich über ein persönliches Konto.',
      },
      {
        title: '2. Registrierung und Konto',
        body: 'Ein persönliches Konto ist für den Zugriff auf gekaufte Kurse erforderlich. Du bist für die Vertraulichkeit deiner Zugangsdaten verantwortlich. Teile den Zugang nicht mit Dritten.',
      },
      {
        title: '3. Preise und Zahlung',
        body: 'Kurspreise sind in der jeweiligen Währung angegeben. Zahlungen werden sicher über Stripe abgewickelt. Der Zugriff wird automatisch nach erfolgreicher Zahlung freigeschaltet.',
      },
      {
        title: '4. Garantie und Rückerstattung',
        body: '30-Tage-Geld-zurück-Garantie ab Kaufdatum. Rückerstattungen werden ohne Fragen bei Anfrage an support@digitalsteam.ai bearbeitet.',
      },
      {
        title: '5. Urheberrecht',
        body: 'Alle Inhalte (Video, PDF, Vorlagen) sind urheberrechtlich geschützt und nur zur persönlichen Nutzung bereitgestellt. Weiterverkauf, Weitergabe oder öffentliche Verbreitung sind untersagt.',
      },
      {
        title: '6. Haftung',
        body: 'Kurse vermitteln Wissen und Werkzeuge. Erreichte Ergebnisse hängen von individueller Anwendung ab. Wir garantieren keine konkreten Einkommen oder Ergebnisse.',
      },
      {
        title: '7. Änderungen',
        body: 'Wir behalten uns das Recht vor, diese Bedingungen zu aktualisieren. Änderungen treten ab dem Datum der Veröffentlichung in Kraft.',
      },
      {
        title: '8. Kontakt',
        body: 'support@digitalsteam.ai · Digital S Team',
      },
    ],
  },
};

export default async function TermsPage({
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
        <h1 className="heading-xl mt-5">{t('termsTitle')}</h1>
        <p className="mt-3 text-xs uppercase tracking-wider text-cream-100/50">
          {t('termsUpdated')}: {updated}
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
