import { ES_PROVINCE_BY_PREFIX } from '@/data/model';

export function isValidSpanishPostalCode(cp: string): boolean {
  const clean = cp.trim();
  if (!/^\d{5}$/.test(clean)) return false;
  const pref = Number(clean.slice(0, 2));
  return pref >= 1 && pref <= 52;
}

export function provinceFromPostalCode(cp: string): string | undefined {
  const clean = cp.trim();
  if (!/^\d{5}$/.test(clean)) return undefined;
  return ES_PROVINCE_BY_PREFIX[clean.slice(0, 2)];
}
