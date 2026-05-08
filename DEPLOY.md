# Deploy guide — Ivon Backend

Този guide ще те преведе от 0 до live URL за ~15 минути. Целта: получаваш публичен линк, който можеш да пратиш на клиента.

## Резюме на стъпките

1. Създаваш Postgres база (Neon, безплатно)
2. Създаваш Stripe test акаунт (или ползваш съществуващ)
3. Импортваш repo-то във Vercel и слагаш env vars
4. Vercel прави deploy и ти дава URL
5. Конфигурираш Stripe webhook към новия URL
6. Seed-ваш базата с курсове

---

## 1. Postgres база — Neon (5 мин)

Не можем да ползваме SQLite на Vercel (serverless = няма persistent disk). Neon има безплатен tier, който е повече от достатъчен за старт.

1. Иди на https://neon.tech → **Sign up** (с GitHub е най-бързо)
2. Create project:
   - Name: `ivon`
   - Postgres version: 16 (default)
   - Region: **Frankfurt (eu-central-1)** — най-близо до България
3. След създаването → Dashboard → **Connection string**
4. Избери **Pooled connection** (важно за Vercel serverless)
5. Копирай URL-а — изглежда така:
   ```
   postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
6. Запази го — ще ти трябва на стъпка 3

## 2. Stripe ключове (3 мин)

### Test mode (за demo на клиента)

1. Login в https://dashboard.stripe.com
2. Горе вдясно → toggle **Test mode** ON
3. Developers → API keys → копирай **Secret key** (`sk_test_...`)
4. Запази го

### Live mode (когато пуснеш реално)

Същото, но в Live mode → `sk_live_...`. Препоръчвам **първо да тестваш всичко в test mode** преди да минеш на live.

## 3. Vercel deploy (5 мин)

1. Иди на https://vercel.com/new
2. Login с GitHub
3. Намери `rrusev548/ivon-backend` → **Import**
4. **Configure Project:**
   - Framework: Next.js (auto-detected)
   - Root directory: `./` (default)
   - Branch: `main` (по подразбиране) или `claude/add-bulgarian-language-5IJRt` ако искаш първо preview
5. **Environment Variables** — добави всички:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | `postgresql://...` (от Neon, стъпка 1) |
   | `SESSION_PASSWORD` | 32+ random chars (виж по-долу) |
   | `ADMIN_EMAIL` | напр. `ivon@example.com` |
   | `ADMIN_PASSWORD` | силна парола |
   | `STRIPE_SECRET_KEY` | `sk_test_...` (от стъпка 2) |
   | `STRIPE_WEBHOOK_SECRET` | остави празно засега, ще го добавим на стъпка 5 |
   | `SITE_URL` | остави празно засега, ще го добавим след първия deploy |

   Генериране на `SESSION_PASSWORD`:
   ```bash
   openssl rand -base64 48
   ```

6. **Deploy** → чакаш ~2 мин
7. Получаваш URL: `https://ivon-backend-<хеш>.vercel.app`

## 4. Финализиране на env vars

След първия deploy:

1. Vercel → твоя проект → Settings → Environment Variables
2. Обнови `SITE_URL` с реалния URL (напр. `https://ivon-backend-xyz.vercel.app`)
3. Redeploy (Deployments → ⋯ → Redeploy)

## 5. Stripe webhook (2 мин)

Това позволява на Stripe да уведомява сайта при успешно плащане.

1. https://dashboard.stripe.com/test/webhooks → **Add endpoint**
2. **Endpoint URL:** `https://<твоят-vercel-url>/api/webhooks/stripe`
3. **Events to listen:** `checkout.session.completed` (минимум)
4. Add endpoint → отваряш го → **Reveal signing secret** → копирай (`whsec_...`)
5. Vercel → Environment Variables → добави `STRIPE_WEBHOOK_SECRET` = `whsec_...`
6. Redeploy

## 6. Seed на базата (3 мин)

Базата е празна — трябват ѝ курсове, testimonials и т.н.

Локално, с **production** DATABASE_URL:

```bash
# В корена на проекта
DATABASE_URL="postgresql://...neon-url..." npx prisma db push
DATABASE_URL="postgresql://...neon-url..." npm run db:seed
```

Това създава таблиците + 3 курса + admin user-а.

> ⚠️ Внимавай: това пише в production базата. За dev пусни Neon да създаде втори branch (Free tier позволява).

## 7. Тест на сайта

1. Отвори твоя Vercel URL
2. Премини през flow-а:
   - Виж курсовете (`/bg/courses`)
   - Кликни **Купи** → Stripe checkout (test card: `4242 4242 4242 4242`, всяка дата в бъдещето, всеки CVC)
   - След плащане → пренасочване към success page
   - Влез в `/admin` с ADMIN_EMAIL/ADMIN_PASSWORD → виж enrollment
3. Готово — пращай URL-а на клиента

## Auto-deploy при промени

След първия setup, всеки `git push` към `main` автоматично trigger-ва нов deploy. Не правиш нищо допълнително.

За preview deploys (без да буташ продакшън):
- Push към друг branch → Vercel дава отделен URL за този branch
- Merge към `main` → продакшънът се обновява

## Troubleshooting

**Build fail-ва с "Prisma Client could not connect to the database":**
- Провери `DATABASE_URL` — трябва да е **Pooled connection** от Neon
- Трябва да завършва с `?sslmode=require`

**Stripe checkout не пренасочва правилно:**
- Провери `SITE_URL` — трябва да е пълният Vercel URL **без** trailing slash

**Webhook signature verification fails:**
- `STRIPE_WEBHOOK_SECRET` трябва да съответства на endpoint-а, който си създал в Stripe dashboard
- Test mode webhooks не работят с Live keys и обратно

**"Module not found: @prisma/client":**
- Vercel build cache може да е stale. Settings → General → "Clear Build Cache" → Redeploy
