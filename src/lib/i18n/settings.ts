// Framework-agnostic i18n settings — safe to import from server components
// (no i18next / browser-only code here).

export const SUPPORTED_LNGS = ['de', 'en', 'fr', 'ar'] as const;
export type Lang = (typeof SUPPORTED_LNGS)[number];

export const FALLBACK_LNG: Lang = 'de';
export const LANG_COOKIE = 'NEXT_LOCALE';

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && (SUPPORTED_LNGS as readonly string[]).includes(value);
}

/** Resolve the request language: cookie wins, then Accept-Language, then fallback. */
export function pickLanguage(
  cookieValue?: string | null,
  acceptLanguage?: string | null,
): Lang {
  if (isLang(cookieValue)) return cookieValue;
  if (acceptLanguage) {
    for (const part of acceptLanguage.split(',')) {
      const code = part.trim().slice(0, 2).toLowerCase();
      if (isLang(code)) return code;
    }
  }
  return FALLBACK_LNG;
}

export const dirFor = (lng: string): 'rtl' | 'ltr' => (lng === 'ar' ? 'rtl' : 'ltr');
