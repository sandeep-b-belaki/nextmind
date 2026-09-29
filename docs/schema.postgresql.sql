-- NextMind — PostgreSQL production schema
-- The running demo uses SQLite (data/nextmind.db) with an equivalent schema.
-- Apply this file to PostgreSQL for production deployments:
--   psql "$DATABASE_URL" -f docs/schema.postgresql.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin', -- admin | editor
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  admin_id   INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id             SERIAL PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  name_kn        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  name_hi        TEXT NOT NULL DEFAULT '',
  icon           TEXT NOT NULL DEFAULT '📁',
  description_kn TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_hi TEXT NOT NULL DEFAULT '',
  sort_order     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS departments (
  id      SERIAL PRIMARY KEY,
  slug    TEXT NOT NULL UNIQUE,
  name_kn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS schemes (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name_kn          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  name_hi          TEXT NOT NULL DEFAULT '',
  desc_kn          TEXT NOT NULL DEFAULT '',
  desc_en          TEXT NOT NULL DEFAULT '',
  desc_hi          TEXT NOT NULL DEFAULT '',
  simple_kn        TEXT NOT NULL DEFAULT '',
  simple_en        TEXT NOT NULL DEFAULT '',
  simple_hi        TEXT NOT NULL DEFAULT '',
  category_id      INTEGER NOT NULL REFERENCES categories(id),
  department_id    INTEGER NOT NULL REFERENCES departments(id),
  start_date       DATE NOT NULL,
  last_date        DATE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','published','expired','needs_verification')),
  official_url     TEXT NOT NULL DEFAULT '',
  notification_pdf TEXT,
  tutorial_video   TEXT,
  image            TEXT,
  last_verified_at DATE NOT NULL DEFAULT CURRENT_DATE,
  verify_status    TEXT NOT NULL DEFAULT 'needs_review'
                   CHECK (verify_status IN ('verified','needs_review','expired')),
  view_count       INTEGER NOT NULL DEFAULT 0,
  is_demo          INTEGER NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category_id);
CREATE INDEX IF NOT EXISTS idx_schemes_last_date ON schemes(last_date);

CREATE TABLE IF NOT EXISTS eligibility_rules (
  id        SERIAL PRIMARY KEY,
  scheme_id INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  field     TEXT NOT NULL,  -- residency|student|farmer|disability|gender|employment|age_min|age_max|income_max
  operator  TEXT NOT NULL,  -- eq|gte|lte
  value     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id         SERIAL PRIMARY KEY,
  scheme_id  INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  name_kn    TEXT NOT NULL,
  name_en    TEXT NOT NULL,
  name_hi    TEXT NOT NULL DEFAULT '',
  desc_kn    TEXT NOT NULL DEFAULT '',
  desc_en    TEXT NOT NULL DEFAULT '',
  desc_hi    TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS application_steps (
  id          SERIAL PRIMARY KEY,
  scheme_id   INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title_kn    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  title_hi    TEXT NOT NULL DEFAULT '',
  body_kn     TEXT NOT NULL DEFAULT '',
  body_en     TEXT NOT NULL DEFAULT '',
  body_hi     TEXT NOT NULL DEFAULT '',
  tip_kn      TEXT NOT NULL DEFAULT '',
  tip_en      TEXT NOT NULL DEFAULT '',
  tip_hi      TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS tutorials (
  id         SERIAL PRIMARY KEY,
  scheme_id  INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  title_kn   TEXT NOT NULL,
  title_en   TEXT NOT NULL,
  title_hi   TEXT NOT NULL DEFAULT '',
  video_url  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_schemes (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_id  INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, scheme_id)
);

CREATE TABLE IF NOT EXISTS notification_prefs (
  user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  new_schemes  SMALLINT NOT NULL DEFAULT 1,
  deadlines    SMALLINT NOT NULL DEFAULT 1,
  scholarships SMALLINT NOT NULL DEFAULT 0,
  farmers      SMALLINT NOT NULL DEFAULT 0,
  employment   SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  scheme_id  INTEGER REFERENCES schemes(id) ON DELETE SET NULL,
  message    TEXT NOT NULL,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id          SERIAL PRIMARY KEY,
  scheme_id   INTEGER REFERENCES schemes(id) ON DELETE SET NULL,
  scheme_slug TEXT,
  type        TEXT NOT NULL,
  message     TEXT NOT NULL,
  email       TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheme_verification (
  id          SERIAL PRIMARY KEY,
  scheme_id   INTEGER NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  notes       TEXT NOT NULL DEFAULT '',
  admin_id    INTEGER,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hindi (hi) content migration — run once on existing databases:
ALTER TABLE categories      ADD COLUMN IF NOT EXISTS name_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE categories      ADD COLUMN IF NOT EXISTS description_hi TEXT NOT NULL DEFAULT '';
ALTER TABLE departments     ADD COLUMN IF NOT EXISTS name_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE schemes         ADD COLUMN IF NOT EXISTS name_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE schemes         ADD COLUMN IF NOT EXISTS desc_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE schemes         ADD COLUMN IF NOT EXISTS simple_hi      TEXT NOT NULL DEFAULT '';
ALTER TABLE documents       ADD COLUMN IF NOT EXISTS name_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE documents       ADD COLUMN IF NOT EXISTS desc_hi        TEXT NOT NULL DEFAULT '';
ALTER TABLE application_steps ADD COLUMN IF NOT EXISTS title_hi     TEXT NOT NULL DEFAULT '';
ALTER TABLE application_steps ADD COLUMN IF NOT EXISTS body_hi      TEXT NOT NULL DEFAULT '';
ALTER TABLE application_steps ADD COLUMN IF NOT EXISTS tip_hi       TEXT NOT NULL DEFAULT '';
ALTER TABLE tutorials       ADD COLUMN IF NOT EXISTS title_hi       TEXT NOT NULL DEFAULT '';
