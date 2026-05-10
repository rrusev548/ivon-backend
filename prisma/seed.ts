import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const courses = [
  {
    slug: 'level-1',
    level: 1,
    titleBg: 'Ниво 1 — Основи',
    titleEn: 'Level 1 — Foundations',
    titleDe: 'Stufe 1 — Grundlagen',
    shortDescBg:
      'Стартова платформа за всеки, който иска да овладее AI и социалните мрежи без излишна сложност.',
    shortDescEn:
      'A grounded launchpad for anyone serious about mastering AI and social media without the noise.',
    shortDescDe:
      'Eine fundierte Startrampe für alle, die KI und Social Media ohne Lärm wirklich meistern wollen.',
    longDescBg:
      'Изграждаме солидна основа: как мислят алгоритмите, кои AI инструменти заслужават времето ти и как се ражда съдържание, което конвертира. Без бутафорни „хакове“ — само принципи, които работят дълго.',
    longDescEn:
      'We build a real foundation: how the algorithms think, which AI tools deserve your time, and how to ship content that converts. No fake "hacks" — just principles that hold up over time.',
    longDescDe:
      'Wir bauen ein echtes Fundament: wie die Algorithmen denken, welche KI-Werkzeuge deine Zeit verdienen und wie Inhalte entstehen, die konvertieren. Keine billigen „Tricks“ — nur Prinzipien, die langfristig tragen.',
    priceCents: 19900,
    sortOrder: 1,
  },
  {
    slug: 'level-2',
    level: 2,
    titleBg: 'Ниво 2 — Системи',
    titleEn: 'Level 2 — Systems',
    titleDe: 'Stufe 2 — Systeme',
    shortDescBg:
      'Превръщаш отделните умения в повторим продукционен процес.',
    shortDescEn:
      'Turn isolated skills into a repeatable production system.',
    shortDescDe:
      'Verwandle einzelne Fähigkeiten in einen wiederholbaren Produktionsprozess.',
    longDescBg:
      'Тук слагаме структура: pipeline за производство на съдържание, AI workflow-и за бързи итерации, и аналитика, която ти показва какво всъщност работи. Излизаш с ритъм, не с късмет.',
    longDescEn:
      'Now we add structure: a production pipeline, AI workflows for fast iterations, and analytics that show you what actually works. You leave with a rhythm, not luck.',
    longDescDe:
      'Hier setzen wir Struktur: eine Produktions-Pipeline, KI-Workflows für schnelle Iterationen und Analytik, die dir zeigt, was wirklich funktioniert. Du gehst mit Rhythmus, nicht mit Glück.',
    priceCents: 39900,
    sortOrder: 2,
  },
  {
    slug: 'level-3',
    level: 3,
    titleBg: 'Ниво 3 — Мащаб',
    titleEn: 'Level 3 — Scale',
    titleDe: 'Stufe 3 — Skalierung',
    shortDescBg:
      'Растеж, монетизация и операционна устойчивост на ниво бизнес.',
    shortDescEn:
      'Growth, monetisation and operational resilience at a business level.',
    shortDescDe:
      'Wachstum, Monetarisierung und operative Resilienz auf Geschäftsniveau.',
    longDescBg:
      'Експертно ниво. Стратегии за мащаб, диверсификация на каналите, наемане и делегиране, AI агенти за автоматизация и икономика на личния бранд. За хора, които не искат „вирусно видео“, а устойчив бизнес.',
    longDescEn:
      'Expert tier. Scaling strategies, channel diversification, hiring and delegation, AI agents for automation, and personal-brand economics. For people who want a sustainable business, not a viral video.',
    longDescDe:
      'Expert-Stufe. Skalierungsstrategien, Kanal-Diversifikation, Hiring und Delegation, KI-Agenten für Automatisierung und Personal-Brand-Ökonomie. Für Menschen, die ein nachhaltiges Geschäft wollen — kein virales Video.',
    priceCents: 79900,
    sortOrder: 3,
  },
] as const;

const affiliates = [
  {
    nameBg: 'Higgsfield',
    nameEn: 'Higgsfield',
    nameDe: 'Higgsfield',
    descBg: 'Кинематографични AI визии и Soul ID за консистентност на персонажа.',
    descEn: 'Cinematic AI visuals and Soul ID for character consistency.',
    descDe: 'Kinoreife KI-Visuals und Soul ID für konsistente Charaktere.',
    url: 'https://higgsfield.ai/?ref=ivon',
    sortOrder: 1,
  },
  {
    nameBg: 'Midjourney',
    nameEn: 'Midjourney',
    nameDe: 'Midjourney',
    descBg: 'Естетичен AI image generator с богат стилов контрол.',
    descEn: 'Aesthetic AI image generator with deep style control.',
    descDe: 'Ästhetischer KI-Bildgenerator mit tiefer Stilkontrolle.',
    url: 'https://www.midjourney.com/?ref=ivon',
    sortOrder: 2,
  },
  {
    nameBg: 'Runway',
    nameEn: 'Runway',
    nameDe: 'Runway',
    descBg: 'Text- и image-to-video за реклами и social storytelling.',
    descEn: 'Text- and image-to-video for ads and social storytelling.',
    descDe: 'Text- und Bild-zu-Video für Werbung und Social Storytelling.',
    url: 'https://runwayml.com/?ref=ivon',
    sortOrder: 3,
  },
  {
    nameBg: 'ElevenLabs',
    nameEn: 'ElevenLabs',
    nameDe: 'ElevenLabs',
    descBg: 'AI гласове в студио качество за voice-over.',
    descEn: 'Studio-grade AI voices for voice-over.',
    descDe: 'KI-Stimmen in Studioqualität für Voice-over.',
    url: 'https://elevenlabs.io/?ref=ivon',
    sortOrder: 4,
  },
] as const;

const testimonials = [
  {
    authorBg: 'Калина Петрова',
    authorEn: 'Kalina Petrova',
    authorDe: 'Kalina Petrova',
    roleBg: 'Креативен директор',
    roleEn: 'Creative Director',
    roleDe: 'Kreativdirektorin',
    quoteBg:
      'След Ниво 2 спрях да гадая какво да публикувам. Имам процес и резултатите се повториха три месеца подред.',
    quoteEn:
      'After Level 2 I stopped guessing what to post. I have a process now and the results repeated three months in a row.',
    quoteDe:
      'Nach Stufe 2 habe ich aufgehört zu raten, was ich posten soll. Ich habe jetzt einen Prozess — die Ergebnisse wiederholten sich drei Monate in Folge.',
    sortOrder: 1,
  },
  {
    authorBg: 'Мартин Илиев',
    authorEn: 'Martin Iliev',
    authorDe: 'Martin Iliev',
    roleBg: 'Основател, Ателие 12',
    roleEn: 'Founder, Atelier 12',
    roleDe: 'Gründer, Atelier 12',
    quoteBg:
      'Това е първата програма за AI и социални, която говори за бизнес, не за хайп.',
    quoteEn:
      'The first program on AI and social media that talks about business, not hype.',
    quoteDe:
      'Das erste Programm zu KI und Social Media, das über Business spricht — nicht über Hype.',
    sortOrder: 2,
  },
  {
    authorBg: 'Симеон Радев',
    authorEn: 'Simeon Radev',
    authorDe: 'Simeon Radev',
    roleBg: 'Маркетинг лидер',
    roleEn: 'Marketing Lead',
    roleDe: 'Marketing-Leiter',
    quoteBg:
      'Ниво 3 ми спести шест месеца грешки. Системите за мащаб са злато.',
    quoteEn:
      'Level 3 saved me six months of mistakes. The scaling systems alone are gold.',
    quoteDe:
      'Stufe 3 hat mir sechs Monate Fehler erspart. Allein die Skalierungssysteme sind Gold wert.',
    sortOrder: 3,
  },
] as const;

const credentials = [
  {
    valueBg: '10+',
    valueEn: '10+',
    valueDe: '10+',
    labelBg: 'години в индустрията',
    labelEn: 'years in the industry',
    labelDe: 'Jahre Branchenerfahrung',
    sortOrder: 1,
  },
  {
    valueBg: '200+',
    valueEn: '200+',
    valueDe: '200+',
    labelBg: 'обучени професионалисти',
    labelEn: 'professionals trained',
    labelDe: 'ausgebildete Profis',
    sortOrder: 2,
  },
  {
    valueBg: '50M+',
    valueEn: '50M+',
    valueDe: '50M+',
    labelBg: 'органични показвания',
    labelEn: 'organic impressions',
    labelDe: 'organische Impressionen',
    sortOrder: 3,
  },
  {
    valueBg: '3',
    valueEn: '3',
    valueDe: '3',
    labelBg: 'езика на обучението',
    labelEn: 'training languages',
    labelDe: 'Trainingssprachen',
    sortOrder: 4,
  },
] as const;

const popup = {
  enabled: true,
  titleBg: 'Стартирай днес с −15%',
  titleEn: 'Start today — 15% off',
  titleDe: 'Starte heute — 15 % Rabatt',
  bodyBg:
    'Запиши се за Ниво 1 тази седмица и получаваш −15% автоматично на checkout-а.',
  bodyEn:
    'Enrol in Level 1 this week and get 15% off automatically at checkout.',
  bodyDe:
    'Schreibe dich diese Woche für Stufe 1 ein und erhalte 15 % Rabatt automatisch an der Kasse.',
  ctaLabelBg: 'Виж курса',
  ctaLabelEn: 'View the course',
  ctaLabelDe: 'Zum Kurs',
  ctaUrl: '/courses/level-1',
  delaySec: 18,
} as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ivon.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });
  console.log(`Admin: ${adminEmail}`);

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    console.log(`Course: ${c.slug}`);
  }

  if ((await prisma.affiliateLink.count()) === 0) {
    for (const a of affiliates) await prisma.affiliateLink.create({ data: a });
  }
  if ((await prisma.testimonial.count()) === 0) {
    for (const t of testimonials) await prisma.testimonial.create({ data: t });
  }
  if ((await prisma.credential.count()) === 0) {
    for (const cr of credentials) await prisma.credential.create({ data: cr });
  }

  await prisma.popupConfig.upsert({
    where: { id: 'singleton' },
    update: popup,
    create: { id: 'singleton', ...popup },
  });
  console.log('Popup, affiliates, testimonials, credentials seeded.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
