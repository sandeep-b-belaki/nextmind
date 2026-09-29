# NextMind

**Government Schemes, Explained Simply.** (ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಸರಳವಾಗಿ ವಿವರಿಸಲ್ಪಟ್ಟಿವೆ)

🔗 **Live:** https://nextmind-delta.vercel.app

NextMind is a Kannada-first information platform that explains Karnataka Government schemes, scholarships, yojanas, subsidies and welfare programs in simple language — with eligibility, document checklists, step-by-step application guides and official links.

> ⚠️ **NextMind is an independent information platform and is NOT a government website.**
> All schemes in this build are clearly labelled **DEMO DATA** — sample content, not real government schemes.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Neon connection string
npm run dev
```

Open http://localhost:3000

On the first request the app applies `docs/schema.postgresql.sql` and seeds the
demo content (100 schemes, 10 categories) into the database — no manual
migration step.

- Public site: Home, Schemes (search + filters), Categories, Scheme details, Find Schemes questionnaire, How It Works, About, Contact
- Language switch: **ಕನ್ನಡ | English** (cookie based; `/kannada/...` URLs also work)
- User accounts: register/login, saved schemes, notification preferences
- Admin dashboard: **`/admin`** — see [Admin dashboard](#admin-dashboard)

```bash
npm run build && npm start   # production build
npm run lint
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Pooled Postgres connection string (Neon `-pooler` host) |
| `DATABASE_URL_UNPOOLED` | no | Direct connection, for migrations and long transactions |
| `NEON_BRANCH` | no | Neon branch name, for reference |
| `NEXT_PUBLIC_SITE_URL` | recommended | Public origin used by `sitemap.xml`, `robots.txt` and Open Graph tags. Without it these fall back to the `https://nextmind.example` placeholder |

Local values go in `.env.local` (gitignored). On Vercel set them under
**Settings → Environment Variables** and redeploy — env changes only apply to
new builds.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Next.js API routes (REST — reusable by a future mobile app) |
| Database | PostgreSQL (Neon) via `pg`, with a pooled connection and read retry on dropped idle connections |
| Auth | Session cookies, scrypt-hashed passwords, HttpOnly + SameSite |
| Notifications | Preferences stored; ready for Firebase Cloud Messaging |
| SEO | Per-scheme URLs, metadata, Open Graph, JSON-LD (`GovernmentService`), `sitemap.ts`, `robots.ts` |
| Hosting | Vercel (serverless) |

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage (hero, categories, new/popular schemes)
│   ├── schemes/                 # Search + filters, scheme details
│   ├── categories/              # Category list + per-category pages
│   ├── find-schemes/            # "Find Schemes For Me" questionnaire
│   ├── how-it-works/ about/ contact/ notifications/ account/ login/ register/
│   ├── admin/                   # Secure admin dashboard (login + panel)
│   ├── api/                     # REST: auth, schemes, find, saved, contact, admin…
│   ├── sitemap.ts  robots.ts
├── middleware.ts                # /kannada/* locale URLs
├── components/                  # Header, Footer, cards, checklist, forms…
├── lib/
│   ├── pg.ts                    # Postgres pool, query helpers, lazy init
│   ├── db.ts                    # Schema apply + demo seed
│   ├── demo-data.ts  demo-data-extra.ts   # Bilingual DEMO schemes/categories/departments
│   ├── schemes.ts  eligibility.ts  auth.ts  admin.ts  i18n.ts
docs/schema.postgresql.sql       # PostgreSQL schema (applied on first request)
```

## Deployment

Deployed on Vercel from the `main` branch; every push redeploys.

Two things this project needs beyond a stock Next.js deploy:

1. **Environment variables** must be set in the Vercel project (see above).
   `pg.ts` throws on a missing `DATABASE_URL`, which surfaces as a 500 on every
   page.
2. **`docs/schema.postgresql.sql` must ship with the serverless functions.**
   It is read at runtime through `process.cwd()`, which Next's file tracing
   does not follow, so `next.config.mjs` adds it via
   `experimental.outputFileTracingIncludes`.

## Admin dashboard

Menu: Dashboard · Schemes · Categories · Departments · Tutorials · Notifications · Users · Reports · Settings

- **Add/Edit scheme**: bilingual names, descriptions, simple explanation, eligibility rules, documents, application steps, official URL, PDF, tutorial video, dates, status
- **Verification system**: every scheme has `Last Verified` + 🟢 Verified / 🟡 Needs Review / 🔴 Expired with an audit trail (`scheme_verification`)

The seed creates one admin account, `admin@nextmind.demo`, with a default
password defined in `src/lib/db.ts`. **Change it before exposing a deployment
publicly** — the seed only runs once, so rotating it on an existing database
means updating the `admin_users.password_hash` row, not just editing the seed.

## Security notes

- Admin and user sessions in HttpOnly cookies; scrypt password hashing with timing-safe compare
- All SQL uses bound parameters; all inputs validated at API boundaries
- Admin routes/APIs guarded server-side; credentials only in the database, never in frontend code
- Connection strings live in environment variables only; `.env.local` is gitignored
