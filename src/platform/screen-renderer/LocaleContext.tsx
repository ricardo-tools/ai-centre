'use client';

import { createContext, useContext } from 'react';
import { getTranslations } from '@/platform/i18n';
import type { TranslationKey } from '@/platform/i18n';
import type { SupportedLocale } from '@/platform/i18n';

interface LocaleContextValue {
  locale: string;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en-AU',
  t: getTranslations('en-AU'),
});

interface LocaleProviderProps {
  locale: SupportedLocale;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const t = getTranslations(locale);
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Widgets use this hook to access translations. Components receive strings as props instead. */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
