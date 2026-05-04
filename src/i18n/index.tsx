import React, { createContext, useContext, useMemo, useState } from 'react';
import { TRANSLATIONS, RTL_LANGS, Lang } from './translations';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function formatNumberFa(n: number): string {
  return n
    .toString()
    .split('')
    .map((d) => (d === '-' ? '-' : PERSIAN_DIGITS[parseInt(d, 10)] ?? d))
    .join('');
}

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRTL: boolean;
  t: (typeof TRANSLATIONS)[Lang];
  formatNumber: (n: number) => string;
  formatTime: (totalSeconds: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLang = 'fa',
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);

  const value = useMemo<I18nContextValue>(() => {
    const isRTL = RTL_LANGS.includes(lang);
    const formatNumber = (n: number) =>
      lang === 'fa' ? formatNumberFa(n) : n.toString();
    const formatTime = (totalSeconds: number) => {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      const pad = (v: number) =>
        formatNumber(v).padStart(2, lang === 'fa' ? '۰' : '0');
      return `${pad(m)}:${pad(s)}`;
    };
    return {
      lang,
      setLang,
      isRTL,
      t: TRANSLATIONS[lang],
      formatNumber,
      formatTime,
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export type { Lang } from './translations';
export { LANGUAGES } from './translations';
