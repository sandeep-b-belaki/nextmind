import type { Scheme } from './types';

export function applicationStatus(scheme: Pick<Scheme, 'start_date' | 'last_date' | 'status'>): 'open' | 'closed' | 'upcoming' {
  const today = new Date().toISOString().slice(0, 10);
  if (scheme.status === 'expired') return 'closed';
  if (scheme.start_date > today) return 'upcoming';
  if (scheme.last_date < today) return 'closed';
  return 'open';
}
