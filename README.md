# Ivon — AI tools & prompts catalog

Bilingual (Bulgarian / English) catalog of AI tools with ready-to-use prompts and
affiliate links. Includes a password-protected admin panel for managing tools
and prompts.

## Stack

- **Next.js 15** (App Router) — frontend + API routes
- **Prisma + SQLite** — local file database (`prisma/dev.db`)
- **next-intl** — i18n routing under `/bg/...` and `/en/...`
- **iron-session + bcrypt** — admin authentication
- **Tailwind CSS** — styling

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set SESSION_PASSWORD (32+ chars), ADMIN_EMAIL, ADMIN_PASSWORD

# 3. Create the SQLite database
npx prisma db push

# 4. Seed sample data (Higgsfield, Midjourney, Runway, Kling)
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open:

- Public site: <http://localhost:3000> (auto-redirects to `/bg`)
- English: <http://localhost:3000/en>
- Tool detail: <http://localhost:3000/bg/tools/higgsfield>
- Admin: <http://localhost:3000/admin> (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Project layout

```
prisma/
  schema.prisma         # AdminUser, Tool, Prompt models
  seed.ts               # bootstraps admin + sample tools/prompts
src/
  app/
    [locale]/           # public, localized pages (BG / EN)
      page.tsx          # homepage with featured + all tools
      tools/page.tsx    # catalog
      tools/[slug]/...  # tool detail with prompts + affiliate CTA
    admin/
      layout.tsx        # html/body shell (no auth)
      login/...         # public login form
      (authed)/...      # auth-protected dashboard, tool & prompt CRUD
    api/admin/...       # JSON endpoints for login/logout/CRUD
  components/           # SiteHeader, SiteFooter, ToolCard, PromptCard, ...
  lib/
    db.ts               # shared Prisma client
    i18n.ts             # next-intl request config
    session.ts          # iron-session helpers
    auth.ts             # bcrypt admin user helpers
    locale.ts           # picks BG/EN fields off Prisma rows
  messages/{bg,en}.json # UI strings
  middleware.ts         # next-intl locale routing
```

## Bilingual content

Each `Tool` and `Prompt` row stores both `*En` and `*Bg` text fields. The
public pages pick the active locale via `pickToolFields` / `pickPromptFields`
(`src/lib/locale.ts`). UI labels (nav, CTAs, footer) live in
`src/messages/{bg,en}.json`.

## Admin panel

- `/admin/login` — email + password form
- `/admin` — dashboard with counts and quick links
- `/admin/tools` — list, create, edit, delete tools
- `/admin/prompts` — list, create, edit, delete prompts (linked to a tool)

A bootstrap step in `(authed)/layout.tsx` upserts the admin user from
`ADMIN_EMAIL` / `ADMIN_PASSWORD` on first request, so you don't need a manual
sign-up step. To change the password, update `.env` and either re-run the seed
or edit the row via Prisma Studio.

## Production notes

- Set a strong `SESSION_PASSWORD` (32+ characters of random data).
- Switch `DATABASE_URL` to Postgres for multi-instance deploys (update
  `provider` in `prisma/schema.prisma` accordingly).
- All affiliate links use `rel="nofollow sponsored noopener noreferrer"` and
  open in a new tab.
