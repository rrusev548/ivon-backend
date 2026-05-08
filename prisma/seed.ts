import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const tools = [
  {
    slug: 'higgsfield',
    nameEn: 'Higgsfield',
    nameBg: 'Higgsfield',
    taglineEn: 'Cinematic AI image & video with character consistency.',
    taglineBg: 'Кинематографични AI изображения и видео със запазен персонаж.',
    descriptionEn:
      'Higgsfield is an AI studio focused on cinematic motion, product photoshoots and Soul ID for keeping character likeness across shots. Strong choice for marketing creatives, ad concepts and short-form video.',
    descriptionBg:
      'Higgsfield е AI студио, специализирано в кинематографично движение, продуктови фотосесии и Soul ID за запазване на лицеви черти между кадри. Силен избор за маркетинг креативи, рекламни концепции и кратки видеа.',
    iconUrl: null,
    affiliateUrl: 'https://higgsfield.ai/?ref=ivon',
    category: 'image+video',
    featured: true,
    sortOrder: 1,
    prompts: [
      {
        titleEn: 'Cinematic product hero shot',
        titleBg: 'Кинематографичен продуктов кадър',
        contentEn:
          'Cinematic close-up of {{product}} on a matte black surface, dramatic side rim light, volumetric haze, shallow depth of field, 35mm anamorphic, color graded teal & amber, hyperreal product photography.',
        contentBg:
          'Кинематографичен едър план на {{продукт}} върху матово черна повърхност, драматична странична светлина, обемна мъгла, плитка дълбочина на рязкост, 35мм анаморфен обектив, цветова корекция teal и amber, хиперреална продуктова фотография.',
        sortOrder: 1,
      },
      {
        titleEn: 'Soul ID character portrait',
        titleBg: 'Soul ID портрет на персонаж',
        contentEn:
          'Editorial portrait of {{character}}, soft window light, neutral linen backdrop, 85mm lens, skin texture preserved, calm and confident expression, magazine cover quality.',
        contentBg:
          'Редакторски портрет на {{персонаж}}, мека светлина от прозорец, неутрален ленен фон, 85мм обектив, запазена текстура на кожата, спокойно и уверено изражение, качество за корица на списание.',
        sortOrder: 2,
      },
      {
        titleEn: 'Slow-mo cinematic ad',
        titleBg: 'Slow-mo кинематографична реклама',
        contentEn:
          '{{subject}} moves through golden hour light, slow-motion 120fps, dust particles in the air, lens flare, handheld camera with subtle parallax, warm filmic LUT.',
        contentBg:
          '{{обект}} се движи през светлина на златен час, slow-motion 120fps, прашинки във въздуха, lens flare, ръчна камера с лек parallax, топъл филмов LUT.',
        sortOrder: 3,
      },
    ],
  },
  {
    slug: 'midjourney',
    nameEn: 'Midjourney',
    nameBg: 'Midjourney',
    taglineEn: 'High-aesthetic AI image generation with strong style control.',
    taglineBg: 'Високо естетична AI генерация на изображения със силен контрол върху стила.',
    descriptionEn:
      'Midjourney is one of the most popular AI image generators, known for stunning out-of-the-box aesthetics, sref style references and a fast iteration loop. Great for moodboards, concept art and brand visuals.',
    descriptionBg:
      'Midjourney е един от най-популярните AI генератори на изображения, известен с впечатляваща естетика по подразбиране, sref стилови референции и бърза итерация. Подходящ за moodboard-ове, концепт арт и визуални идентичности.',
    iconUrl: null,
    affiliateUrl: 'https://www.midjourney.com/?ref=ivon',
    category: 'image',
    featured: true,
    sortOrder: 2,
    prompts: [
      {
        titleEn: 'Editorial fashion moodboard',
        titleBg: 'Редакторски moodboard за мода',
        contentEn:
          'editorial fashion photography, {{model}} in {{outfit}}, warm sunlight bouncing off concrete, soft grain, kodak portra 400, --ar 4:5 --style raw --stylize 250',
        contentBg:
          'редакторска фотография на мода, {{модел}} в {{облекло}}, топла слънчева светлина, отразяваща се в бетон, мека зърнистост, kodak portra 400, --ar 4:5 --style raw --stylize 250',
        sortOrder: 1,
      },
      {
        titleEn: 'Brand poster',
        titleBg: 'Брандов постер',
        contentEn:
          'minimal brand poster for {{brand}}, isometric composition, 3 colors max, swiss typography, generous negative space, --ar 2:3 --v 6',
        contentBg:
          'минимален брандов постер за {{бранд}}, изометрична композиция, максимум 3 цвята, швейцарска типография, щедро негативно пространство, --ar 2:3 --v 6',
        sortOrder: 2,
      },
    ],
  },
  {
    slug: 'runway',
    nameEn: 'Runway',
    nameBg: 'Runway',
    taglineEn: 'Text- and image-to-video for filmmakers and marketers.',
    taglineBg: 'Текст- и image-to-video за филмови продуценти и маркетинг.',
    descriptionEn:
      'Runway pioneered consumer-grade AI video. Use Gen-3 / Gen-4 to animate stills, extend clips and produce camera moves. Strong choice for ads, music videos and social storytelling.',
    descriptionBg:
      'Runway е пионер в потребителското AI видео. Използвай Gen-3 / Gen-4, за да анимираш статични кадри, да удължаваш клипове и да създаваш движения на камерата. Силен избор за реклами, музикални видеа и social storytelling.',
    iconUrl: null,
    affiliateUrl: 'https://runwayml.com/?ref=ivon',
    category: 'video',
    featured: true,
    sortOrder: 3,
    prompts: [
      {
        titleEn: 'Camera dolly-in on subject',
        titleBg: 'Dolly-in върху обекта',
        contentEn:
          'slow dolly-in on {{subject}}, cinematic lighting, subtle handheld micro-movement, shallow depth of field, atmospheric haze, 4 second clip.',
        contentBg:
          'бавен dolly-in върху {{обект}}, кинематографична светлина, лек handheld микро-трепет, плитка дълбочина на рязкост, атмосферна мъгла, 4-секунден клип.',
        sortOrder: 1,
      },
      {
        titleEn: 'Image-to-video animation',
        titleBg: 'Анимация от image-to-video',
        contentEn:
          'gentle parallax on the still, foreground sways slightly, particles drift across frame, soft camera breathing, no abrupt motion.',
        contentBg:
          'лек parallax върху статичния кадър, преден план се полюшва леко, частици се носят през кадъра, нежно „дишане“ на камерата, без резки движения.',
        sortOrder: 2,
      },
    ],
  },
  {
    slug: 'kling',
    nameEn: 'Kling AI',
    nameBg: 'Kling AI',
    taglineEn: 'Long-form, physics-aware AI video generation.',
    taglineBg: 'Дълги AI видеа с реалистична физика.',
    descriptionEn:
      'Kling produces longer clips with strong motion coherence and convincing physics. A great complement to Runway when a scene needs sustained, believable action.',
    descriptionBg:
      'Kling генерира по-дълги клипове със силна кохерентност на движението и убедителна физика. Отличен допълващ инструмент към Runway, когато сцена изисква продължително, правдоподобно действие.',
    iconUrl: null,
    affiliateUrl: 'https://klingai.com/?ref=ivon',
    category: 'video',
    featured: false,
    sortOrder: 4,
    prompts: [
      {
        titleEn: 'Long action shot',
        titleBg: 'Дълъг екшън кадър',
        contentEn:
          '{{subject}} runs across {{environment}}, dynamic tracking shot, realistic physics, motion blur, 8 second clip.',
        contentBg:
          '{{обект}} тича през {{среда}}, динамичен tracking shot, реалистична физика, motion blur, 8-секунден клип.',
        sortOrder: 1,
      },
    ],
  },
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ivon.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin1234';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });
  console.log(`Admin ready: ${adminEmail}`);

  for (const tool of tools) {
    const { prompts, ...data } = tool;
    const saved = await prisma.tool.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    await prisma.prompt.deleteMany({ where: { toolId: saved.id } });
    for (const prompt of prompts) {
      await prisma.prompt.create({ data: { ...prompt, toolId: saved.id } });
    }
    console.log(`Seeded ${data.slug} (${prompts.length} prompts)`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
