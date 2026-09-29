# NextMind

**Government Schemes, Explained Simply.** (ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಸರಳವಾಗಿ ವಿವರಿಸಲ್ಪಟ್ಟಿವೆ)

NextMind is a Kannada-first information platform that explains Karnataka Government schemes, scholarships, yojanas, subsidies and welfare programs in simple language — with eligibility, document checklists, step-by-step application guides and official links.

> ⚠️ **NextMind is an independent information platform and is NOT a government website.**
> All schemes in this build are clearly labelled **DEMO DATA** — sample content, not real government schemes.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

- Public site: Home, Schemes (search + filters), Categories, Scheme details, Find Schemes questionnaire, How It Works, About, Contact
- Language switch: **ಕನ್ನಡ | English** (cookie based; `/kannada/...` URLs also work)
- User accounts: register/login, saved schemes, notification preferences
- Admin dashboard: **`/admin`** — demo login `admin@nextmind.demo` / `Admin@1234`

```bash
npm run build && npm start   # production build
npm run lint
```

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Next.js API routes (REST — reusable by a future mobile app) |
| Database | SQLite via `better-sqlite3` for the demo; PostgreSQL schema in `docs/schema.postgresql.sql` |
| Auth | Session cookies, scrypt-hashed passwords, HttpOnly + SameSite |
| Notifications | Preferences stored; ready for Firebase Cloud Messaging |
| SEO | Per-scheme URLs, metadata, Open Graph, JSON-LD (`GovernmentService`), `sitemap.ts`, `robots.ts` |

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
│   ├── sitemap.ts  robots.ts  middleware.ts (/kannada/* locale URLs)
├── components/                  # Header, Footer, cards, checklist, forms…
├── lib/
│   ├── db.ts                    # Schema + seed (13 demo schemes)
│   ├── demo-data.ts             # Bilingual DEMO schemes/categories/departments
│   ├── schemes.ts  eligibility.ts  auth.ts  admin.ts  i18n.ts
docs/schema.postgresql.sql       # Production PostgreSQL schema
data/nextmind.db                 # SQLite (created on first run)
```

## Admin dashboard

Menu: Dashboard · Schemes · Categories · Departments · Tutorials · Notifications · Users · Reports · Settings

- **Add/Edit scheme**: bilingual names, descriptions, simple explanation, eligibility rules, documents, application steps, official URL, PDF, tutorial video, dates, status
- **Verification system**: every scheme has `Last Verified` + 🟢 Verified / 🟡 Needs Review / 🔴 Expired with an audit trail (`scheme_verification`)

## Security notes

- Admin and user sessions in HttpOnly cookies; scrypt password hashing with timing-safe compare
- All SQL uses bound parameters; all inputs validated at API boundaries
- Admin routes/APIs guarded server-side; credentials only in the database, never in frontend code
- Change the demo admin password and enable HTTPS before any real deployment
