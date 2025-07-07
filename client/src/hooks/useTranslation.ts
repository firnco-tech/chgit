/**
 * TRANSLATION HOOK
 * 
 * Provides access to translated strings based on current language
 */

import { translations } from '../../../shared/translations';
import { getCurrentLanguage } from '../lib/i18n';

export const useTranslation = () => {
  const currentLanguage = getCurrentLanguage();
  const t = translations[currentLanguage];
  
  return {
    t,
    currentLanguage
  };
};