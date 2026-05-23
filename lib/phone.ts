import { parsePhoneNumberFromString } from 'libphonenumber-js/max';

export function isValidKsaPhone(raw: string): boolean {
  const cleaned = raw.replace(/\s|-/g, '');
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
