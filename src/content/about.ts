export type AboutMember = {
  name: string;
  roleBg: string;
  roleEn: string;
  roleDe: string;
  bioBg: string;
  bioEn: string;
  bioDe: string;
  photoUrl?: string;
  socials: {
    instagram: string;
    tiktok: string;
  };
};

export const aboutConfig: { members: AboutMember[] } = {
  members: [
    {
      name: 'Digital S Team',
      roleBg: 'Дигитална академия · AI и социални мрежи',
      roleEn: 'Digital Academy · AI and social media',
      roleDe: 'Digital Academy · KI und Social Media',
      bioBg:
        'Digital S Team е екип от практикуващи дигитални професионалисти с над десет години общ опит в съдържание, AI инструменти и алгоритмите на социалните платформи. Изградихме програмата, защото пазарът е пълен с хайп и празни обещания. Нашите курсове са за хора, които искат система, не късмет — стъпка по стъпка, измеримо, повторимо.',
      bioEn:
        'Digital S Team is a group of practicing digital professionals with over a decade of combined experience in content, AI tools, and social platform algorithms. We built this program because the market is full of hype and empty promises. Our courses are for people who want a system, not luck — step by step, measurable, repeatable.',
      bioDe:
        'Digital S Team ist eine Gruppe praktizierender digitaler Profis mit über zehn Jahren gemeinsamer Erfahrung in Content, KI-Tools und Algorithmen sozialer Plattformen. Wir haben dieses Programm aufgebaut, weil der Markt voller Hype und leerer Versprechen ist. Unsere Kurse sind für Menschen, die ein System wollen — Schritt für Schritt, messbar, wiederholbar.',
      socials: {
        instagram: 'https://instagram.com/digitalsteam',
        tiktok: 'https://tiktok.com/@digitalsteam',
      },
    },
  ],
};
