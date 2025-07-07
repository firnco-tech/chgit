import { en } from './en';
import { es } from './es';
import { de } from './de';
import { it } from './it';
import { pt } from './pt';
import { nl } from './nl';

export const translations = {
  en,
  es,
  de,
  it,
  pt,
  nl,
};

export type Language = keyof typeof translations;
export type TranslationKeys = keyof typeof en;

export const supportedLanguages: Language[] = ['en', 'es', 'de', 'it', 'pt', 'nl'];

export const languageNames = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
};