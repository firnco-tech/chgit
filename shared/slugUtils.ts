/**
 * MULTILINGUAL SEO SLUG GENERATION UTILITIES
 * 
 * Generates SEO-friendly, language-specific slugs for profile URLs
 * Format: {firstName}-from-{city}-{country} in each target language
 */

export interface SlugGenerationData {
  firstName: string;
  location: string;
  id?: number;
}

// Location translations for common Dominican cities and regions
const locationTranslations: Record<string, Record<string, string>> = {
  // Major Dominican cities
  'Santiago': {
    en: 'santiago',
    es: 'santiago', 
    de: 'santiago',
    it: 'santiago',
    nl: 'santiago',
    pt: 'santiago'
  },
  'Santo Domingo': {
    en: 'santo-domingo',
    es: 'santo-domingo',
    de: 'santo-domingo', 
    it: 'santo-domingo',
    nl: 'santo-domingo',
    pt: 'santo-domingo'
  },
  'La Romana': {
    en: 'la-romana',
    es: 'la-romana',
    de: 'la-romana',
    it: 'la-romana', 
    nl: 'la-romana',
    pt: 'la-romana'
  },
  'San Pedro de Macorís': {
    en: 'san-pedro-de-macoris',
    es: 'san-pedro-de-macoris',
    de: 'san-pedro-de-macoris',
    it: 'san-pedro-de-macoris',
    nl: 'san-pedro-de-macoris', 
    pt: 'san-pedro-de-macoris'
  },
  'Puerto Plata': {
    en: 'puerto-plata',
    es: 'puerto-plata',
    de: 'puerto-plata',
    it: 'puerto-plata',
    nl: 'puerto-plata',
    pt: 'puerto-plata'
  }
};

// Country translations
const countryTranslations = {
  en: 'dominican-republic',
  es: 'republica-dominicana', 
  de: 'dominikanische-republik',
  it: 'repubblica-dominicana',
  nl: 'dominicaanse-republiek',
  pt: 'republica-dominicana'
};

// Preposition translations for "from"
const fromPrepositions = {
  en: 'from',
  es: 'de',
  de: 'aus', 
  it: 'da',
  nl: 'uit',
  pt: 'de'
};

/**
 * Normalize text for URL slugs
 */
function normalizeForSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers, spaces, hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

/**
 * Get translated location slug
 */
function getLocationSlug(location: string, language: string): string {
  // Check if we have a specific translation
  const translation = locationTranslations[location];
  if (translation && translation[language]) {
    return translation[language];
  }
  
  // Fallback to normalized location
  return normalizeForSlug(location);
}

/**
 * Generate multilingual slugs for a profile
 */
export function generateMultilingualSlugs(data: SlugGenerationData): Record<string, string> {
  const { firstName, location } = data;
  const normalizedFirstName = normalizeForSlug(firstName);
  
  const slugs: Record<string, string> = {};
  
  // Generate slug for each supported language
  const languages = ['en', 'es', 'de', 'it', 'nl', 'pt'];
  
  for (const lang of languages) {
    const fromPreposition = fromPrepositions[lang as keyof typeof fromPrepositions];
    const locationSlug = getLocationSlug(location, lang);
    const countrySlug = countryTranslations[lang as keyof typeof countryTranslations];
    
    // Format: {firstName}-{from}-{city}-{country}
    slugs[lang] = `${normalizedFirstName}-${fromPreposition}-${locationSlug}-${countrySlug}`;
  }
  
  return slugs;
}

/**
 * Ensure slug uniqueness by appending number if needed
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[], maxAttempts: number = 100): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  for (let i = 2; i <= maxAttempts; i++) {
    const candidateSlug = `${baseSlug}-${i}`;
    if (!existingSlugs.includes(candidateSlug)) {
      return candidateSlug;
    }
  }
  
  // Fallback with timestamp if all numbers are taken
  return `${baseSlug}-${Date.now()}`;
}

/**
 * Parse slug to extract profile information
 */
export function parseSlugInfo(slug: string, language: string): { firstName?: string; location?: string } {
  const fromPreposition = fromPrepositions[language as keyof typeof fromPrepositions];
  const countrySlug = countryTranslations[language as keyof typeof countryTranslations];
  
  // Remove country suffix
  const withoutCountry = slug.replace(`-${countrySlug}`, '');
  
  // Split by the "from" preposition
  const parts = withoutCountry.split(`-${fromPreposition}-`);
  
  if (parts.length === 2) {
    return {
      firstName: parts[0].replace(/-/g, ' '),
      location: parts[1].replace(/-/g, ' ')
    };
  }
  
  return {};
}

/**
 * Get slug field name for a language
 */
export function getSlugFieldName(language: string): string {
  const fieldMap: Record<string, string> = {
    en: 'slugEn',
    es: 'slugEs', 
    de: 'slugDe',
    it: 'slugIt',
    nl: 'slugNl',
    pt: 'slugPt'
  };
  
  return fieldMap[language] || 'slugEn';
}

/**
 * Get all supported language codes
 */
export function getSupportedLanguages(): string[] {
  return ['en', 'es', 'de', 'it', 'nl', 'pt'];
}