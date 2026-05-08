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
      name: 'Ivon',
      roleBg: 'Основател и водещ обучител',
      roleEn: 'Founder & lead instructor',
      roleDe: 'Gründer und Hauptdozent',
      bioBg:
        'Над десет години в индустрията на дигиталното съдържание, AI и социалните платформи. Стартирах програмата, защото пазарът беше пълен с хайп и празни обещания. Курсовете ми са за хора, които искат система, а не късмет.',
      bioEn:
        'Over a decade in digital content, AI and social platforms. I built this program because the market is full of hype and empty promises. My courses are for people who want a system, not luck.',
      bioDe:
        'Über zehn Jahre in digitalen Inhalten, KI und sozialen Plattformen. Ich habe dieses Programm gestartet, weil der Markt voller Hype und leerer Versprechen ist. Meine Kurse sind für Menschen, die ein System wollen — kein Glück.',
      socials: {
        instagram: 'https://instagram.com/ivon',
        tiktok: 'https://tiktok.com/@ivon',
      },
    },
  ],
};
