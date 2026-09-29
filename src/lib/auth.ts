import crypto from 'crypto';
import { cookies } from 'next/headers';
import { rows, row, run } from './pg';
import type { AdminUser, User } from './types';

export { hashPassword, verifyPassword } from './password';

const SESSION_COOKIE = 'nm_session';
const ADMIN_COOKIE = 'nm_admin';
const SESSION_DAYS = 30;

function randomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function expiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + SESSION_DAYS);
  return d.toISOString();
}

export async function createSession(userId: number | null, adminId: number | null): Promise<string> {
  const token = randomToken();
  await run('INSERT INTO sessions (token, user_id, admin_id, expires_at) VALUES ($1, $2, $3, $4)', [
    token, userId, adminId, expiryDate(),
  ]);
  return token;
}

export async function getUserByToken(token: string): Promise<User | null> {
  const found = await row<User>(
    `SELECT u.id, u.name, u.email, u.created_at FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token]
  );
  return found;
}

export async function getAdminByToken(token: string): Promise<AdminUser | null> {
  const found = await row<AdminUser>(
    `SELECT a.id, a.name, a.email, a.role FROM sessions s
     JOIN admin_users a ON a.id = s.admin_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token]
  );
  return found;
}

export async function destroySession(token: string): Promise<void> {
  await run('DELETE FROM sessions WHERE token = $1', [token]);
}

export async function currentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getUserByToken(token);
}

export async function currentAdmin(): Promise<AdminUser | null> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return getAdminByToken(token);
}

export function setSessionCookie(token: string, kind: 'user' | 'admin') {
  const name = kind === 'admin' ? ADMIN_COOKIE : SESSION_COOKIE;
  cookies().set(name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export function clearSessionCookie(kind: 'user' | 'admin') {
  const name = kind === 'admin' ? ADMIN_COOKIE : SESSION_COOKIE;
  cookies().delete(name);
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await currentAdmin();
  if (!admin) throw new Error('UNAUTHORIZED');
  return admin;
}

export { rows as _authRows };
