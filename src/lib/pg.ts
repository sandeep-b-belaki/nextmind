import { Pool, types } from 'pg';

types.setTypeParser(1082, (v) => v); // date → string
types.setTypeParser(1114, (v) => v); // timestamp → string
types.setTypeParser(1184, (v) => v); // timestamptz → string

declare global {
  // eslint-disable-next-line no-var
  var __nextmindPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __nextmindInit: Promise<void> | undefined;
}

async function ensureInit(): Promise<void> {
  if (!globalThis.__nextmindInit) {
    globalThis.__nextmindInit = (async () => {
      const { initDatabase } = await import('./db');
      await initDatabase();
    })().catch((err) => {
      globalThis.__nextmindInit = undefined; // allow retry after failure
      throw err;
    });
  }
  return globalThis.__nextmindInit;
}

export function pool(): Pool {
  if (!globalThis.__nextmindPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set — create .env.local with your Neon connection string');
    const p = new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis: 20_000, // reap idle sockets before the pooler kills them
      connectionTimeoutMillis: 15_000,
    });
    p.on('error', () => {}); // ignore idle-client errors; pool discards the client
    globalThis.__nextmindPool = p;
  }
  return globalThis.__nextmindPool;
}

const CONN_ERR = /connection terminated|connection ended|ECONNRESET|EPIPE|Client has closed|timeout exceeded/i;
const isRead = (text: string) => /^\s*(select|with)/i.test(text);

// One retry for reads that die on a stale pooled connection (Neon pooler drops idles).
async function query<T>(text: string, params: unknown[]): Promise<{ rows: T[]; rowCount: number | null }> {
  try {
    const r = await pool().query(text, params);
    return { rows: r.rows as T[], rowCount: r.rowCount };
  } catch (err) {
    if (isRead(text) && err instanceof Error && CONN_ERR.test(err.message)) {
      const r = await pool().query(text, params);
      return { rows: r.rows as T[], rowCount: r.rowCount };
    }
    throw err;
  }
}

export async function rows<T>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureInit();
  return rowsRaw<T>(text, params);
}

export async function row<T>(text: string, params: unknown[] = []): Promise<T | null> {
  const r = await rows<T>(text, params);
  return r[0] ?? null;
}

export async function run(text: string, params: unknown[] = []): Promise<number> {
  await ensureInit();
  return runRaw(text, params);
}

export async function queryReturning<T>(text: string, params: unknown[] = []): Promise<T[]> {
  return rows<T>(text, params);
}

// Raw variants: no init hook — safe to call from initDatabase()/seed() itself.
export async function rowsRaw<T>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await query<T>(text, params)).rows;
}

export async function rowRaw<T>(text: string, params: unknown[] = []): Promise<T | null> {
  const r = await rowsRaw<T>(text, params);
  return r[0] ?? null;
}

export async function runRaw(text: string, params: unknown[] = []): Promise<number> {
  const r = await pool().query(text, params);
  return r.rowCount ?? 0;
}
