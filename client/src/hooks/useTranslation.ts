/**
 * TRANSLATION HOOK
 * 
 * Provides access to translated strings based on current language
 */

import { translations } from '@/translations';
import { getCurrentLanguage } from '@/lib/i18n';
import type { Language } from '@/translations';

export const useTranslation = () => {
  const currentLanguage = getCurrentLanguage() as Language;
  const t = translations[currentLanguage] || translations.en;
  
  return {
    t,
    currentLanguage
  };
};