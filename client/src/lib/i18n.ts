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

// Browser language mapping to supported languages
const LANGUAGE_MAPPING: Record<string, SupportedLanguage> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'it': 'it',
  'it-IT': 'it',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'nl': 'nl',
  'nl-NL': 'nl',
  'nl-BE': 'nl',
  'pt': 'pt',
  'pt-BR': 'pt',
  'pt-PT': 'pt'
};

// Detect browser language with comprehensive mapping
export const detectBrowserLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') return null;
  
  const browserLang = navigator.language || navigator.languages?.[0];
  if (!browserLang) return null;
  
  // Try exact match first
  if (browserLang in LANGUAGE_MAPPING) {
    return LANGUAGE_MAPPING[browserLang];
  }
  
  // Try language code only (e.g., 'es' from 'es-MX')
  const langCode = browserLang.split('-')[0];
  if (langCode in LANGUAGE_MAPPING) {
    return LANGUAGE_MAPPING[langCode];
  }
  
  return null;
};

// Check if user has made an explicit language choice
export const hasUserLanguageChoice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('holacupid_language_choice') === 'true';
};

// Mark that user has made a language choice
export const markUserLanguageChoice = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('holacupid_language_choice', 'true');
};

// Check if language suggestion should be shown
export const shouldShowLanguageSuggestion = (): { show: boolean; suggestedLanguage?: SupportedLanguage } => {
  if (typeof window === 'undefined') return { show: false };
  
  // Don't show if user has already made a choice
  if (hasUserLanguageChoice()) {
    return { show: false };
  }
  
  // Don't show if suggestion was dismissed
  if (localStorage.getItem('holacupid_language_suggestion_dismissed')) {
    return { show: false };
  }
  
  // Detect browser language
  const browserLang = detectBrowserLanguage();
  if (!browserLang || browserLang === DEFAULT_LANGUAGE) {
    return { show: false };
  }
  
  // Check if current language is different from browser language
  const currentLang = getCurrentLanguage();
  if (currentLang === browserLang) {
    return { show: false };
  }
  
  return { show: true, suggestedLanguage: browserLang };
};

// Dismiss language suggestion
export const dismissLanguageSuggestion = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('holacupid_language_suggestion_dismissed', 'true');
};

// Navigate to language version of current page
export const navigateToLanguage = (language: SupportedLanguage): void => {
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  const newPath = addLanguageToPath(currentPath, language);
  
  // Update language preference and mark as user choice
  saveLanguagePreference(language);
  markUserLanguageChoice();
  
  // Navigate to new URL
  window.history.pushState({}, '', newPath);
  
  // Trigger page reload to update content
  window.location.reload();
};

// Get best language for user (priority: User choice > URL > saved > browser > default)
export const getBestLanguageForUser = (): SupportedLanguage => {
  // If user has made a choice, respect it
  if (hasUserLanguageChoice()) {
    const savedLang = getSavedLanguagePreference();
    if (savedLang) return savedLang;
  }
  
  const urlLang = getCurrentLanguage();
  const browserLang = detectBrowserLanguage();
  
  // If URL has valid language, use it
  if (urlLang !== DEFAULT_LANGUAGE) {
    return urlLang;
  }
  
  // Fall back to browser language or default
  return browserLang || DEFAULT_LANGUAGE;
};