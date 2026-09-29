import { cookies } from 'next/headers';
import type { Lang } from './types';

export function getLang(): Lang {
  const v = cookies().get('nm_lang')?.value;
  return v === 'en' || v === 'hi' ? v : 'kn';
}
