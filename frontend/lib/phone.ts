import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

/** Normalize raw input to a form libphonenumber-js can parse. */
function preNormalize(raw: string): string {
  const s = raw.replace(/[\s\-().]/g, '');
  if (s.startsWith('00966')) return `+${s.slice(2)}`; // 00966512… → +966512…
  if (/^966\d/.test(s)) return `+${s}`;               // 966512…   → +966512…
  return s;
}

export function isValidKsaPhone(raw: string): boolean {
  const cleaned = preNormalize(raw);
  try {
    const parsed = parsePhoneNumberFromString(cleaned, 'SA');
    return !!parsed && parsed.isValid() && parsed.country === 'SA';
  } catch {
    return false;
  }
}

/** Alias used by Zod form validation */
export const validateKsaPhone = isValidKsaPhone;

export function normalizeKsaPhone(raw: string): string {
  const cleaned = raw.replace(/\s|-/g, '');
  const parsed = parsePhoneNumberFromString(cleaned, 'SA');
  if (!parsed || !parsed.isValid()) return cleaned;
  return parsed.format('E.164'); // "+966XXXXXXXXX"
}
