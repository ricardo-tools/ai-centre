import enAU from './en-AU';
import type { TranslationKey } from './en-AU';

export type { TranslationKey };
export type SupportedLocale = 'en-AU';

const locales: Record<SupportedLocale, typeof enAU> = {
  'en-AU': enAU,
};

/**
 * Returns a translation function for the given locale.
 * Supports simple interpolation: t('key', { count: 5 }) replaces {count} in the string.
 */
export function getTranslations(locale: SupportedLocale = 'en-AU') {
  const translations = locales[locale] ?? locales['en-AU'];

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value: string = translations[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    }
    return value;
  }

  return t;
}
