/**
 * INTERNATIONALIZATION (i18n) SYSTEM
 * 
 * Comprehensive multilingual support for HolaCupid platform
 * Supports: English, Spanish, Italian, German, Dutch, Portuguese
 */

export type SupportedLanguage = 'en' | 'es' | 'it' | 'de' | 'nl' | 'pt';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr'
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    direction: 'ltr'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr'
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    direction: 'ltr'
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    direction: 'ltr'
  }
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Get current language from URL path
export const getCurrentLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const potentialLang = pathParts[0] as SupportedLanguage;
  
  if (potentialLang && SUPPORTED_LANGUAGES[potentialLang]) {
    return potentialLang;
  }
  
  return DEFAULT_LANGUAGE;
};

// Get path without language prefix
export const getPathWithoutLanguage = (path: string = window.location.pathname): string => {
  const pathParts = path.split('/').filter(Boolean);
  const potentialLang = pathParts[0] as SupportedLanguage;
  
  if (potentialLang && SUPPORTED_LANGUAGES[potentialLang]) {
    return '/' + pathParts.slice(1).join('/');
  }
  
  return path;
};

// Add language prefix to path
export const addLanguageToPath = (path: string, language: SupportedLanguage): string => {
  const cleanPath = getPathWithoutLanguage(path);
  return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
};

// Persist language preference
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('holacupid_language', language);
  }
};

// Get saved language preference
export const getSavedLanguagePreference = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('holacupid_language');
  if (saved && SUPPORTED_LANGUAGES[saved as SupportedLanguage]) {
    return saved as SupportedLanguage;
  }
  
  return null;
};

// Detect browser language
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang;
  }
  
  return DEFAULT_LANGUAGE;
};

// Get best language for user (priority: URL > saved > browser > default)
export const getBestLanguageForUser = (): SupportedLanguage => {
  const urlLang = getCurrentLanguage();
  const savedLang = getSavedLanguagePreference();
  const browserLang = detectBrowserLanguage();
  
  // If URL has valid language, use it
  if (urlLang !== DEFAULT_LANGUAGE) {
    return urlLang;
  }
  
  // Otherwise use saved preference or browser language
  return savedLang || browserLang;
};