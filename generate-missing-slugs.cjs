#!/usr/bin/env node

/**
 * SLUG GENERATION SCRIPT FOR EXISTING PROFILES
 * 
 * This script generates SEO-friendly slugs for profiles that don't have them
 * Run this after deploying the slug generation feature
 */

const { Pool } = require('pg');
require('dotenv').config();

// Import slug generation utility (simplified for Node.js)
function normalizeForSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const fromPrepositions = {
  en: 'from',
  es: 'de',
  de: 'aus',
  it: 'da',
  nl: 'uit',
  pt: 'de'
};

const countryTranslations = {
  en: 'dominican-republic',
  es: 'republica-dominicana',
  de: 'dominikanische-republik',
  it: 'repubblica-dominicana',
  nl: 'dominicaanse-republiek',
  pt: 'republica-dominicana'
};

const locationTranslations = {
  'Santiago': {
    en: 'santiago', es: 'santiago', de: 'santiago',
    it: 'santiago', nl: 'santiago', pt: 'santiago'
  },
  'Santo Domingo': {
    en: 'santo-domingo', es: 'santo-domingo', de: 'santo-domingo',
    it: 'santo-domingo', nl: 'santo-domingo', pt: 'santo-domingo'
  },
  'La Romana': {
    en: 'la-romana', es: 'la-romana', de: 'la-romana',
    it: 'la-romana', nl: 'la-romana', pt: 'la-romana'
  },
  'Puerto Plata': {
    en: 'puerto-plata', es: 'puerto-plata', de: 'puerto-plata',
    it: 'puerto-plata', nl: 'puerto-plata', pt: 'puerto-plata'
  },
  'Punta Cana': {
    en: 'punta-cana', es: 'punta-cana', de: 'punta-cana',
    it: 'punta-cana', nl: 'punta-cana', pt: 'punta-cana'
  }
};

function getLocationSlug(location, language) {
  const translation = locationTranslations[location];
  if (translation && translation[language]) {
    return translation[language];
  }
  return normalizeForSlug(location);
}

function generateMultilingualSlugs(data) {
  const { firstName, location } = data;
  const normalizedFirstName = normalizeForSlug(firstName);
  const slugs = {};
  
  const languages = ['en', 'es', 'de', 'it', 'nl', 'pt'];
  
  for (const lang of languages) {
    const fromPreposition = fromPrepositions[lang];
    const locationSlug = getLocationSlug(location, lang);
    const countrySlug = countryTranslations[lang];
    
    slugs[lang] = `${normalizedFirstName}-${fromPreposition}-${locationSlug}-${countrySlug}`;
  }
  
  return slugs;
}

async function generateSlugsForExistingProfiles() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔍 SLUG MIGRATION - Starting slug generation for existing profiles...');
    
    // Get all profiles with missing slugs
    const result = await pool.query(`
      SELECT id, first_name, location, slug_en, slug_es, slug_de, slug_it, slug_nl, slug_pt
      FROM profiles 
      WHERE slug_en IS NULL OR slug_en = '' OR slug_es IS NULL OR slug_es = ''
      ORDER BY id
    `);
    
    console.log(`📊 Found ${result.rows.length} profiles needing slug generation`);
    
    // Get all existing slugs to avoid duplicates (check all language fields)
    const existingSlugsResult = await pool.query(`
      SELECT slug_en, slug_es, slug_de, slug_it, slug_nl, slug_pt 
      FROM profiles 
      WHERE slug_en IS NOT NULL AND slug_en != ''
    `);
    const usedSlugs = new Set();
    existingSlugsResult.rows.forEach(row => {
      if (row.slug_en) usedSlugs.add(row.slug_en);
      if (row.slug_es) usedSlugs.add(row.slug_es);
      if (row.slug_de) usedSlugs.add(row.slug_de);
      if (row.slug_it) usedSlugs.add(row.slug_it);
      if (row.slug_nl) usedSlugs.add(row.slug_nl);
      if (row.slug_pt) usedSlugs.add(row.slug_pt);
    });
    
    for (const profile of result.rows) {
      const baseSlugs = generateMultilingualSlugs({
        firstName: profile.first_name,
        location: profile.location
      });
      
      // Handle duplicate slugs by adding profile ID
      const uniqueSlugs = {};
      for (const [lang, slug] of Object.entries(baseSlugs)) {
        if (usedSlugs.has(slug)) {
          // Add profile ID to make it unique
          uniqueSlugs[lang] = `${slug}-${profile.id}`;
        } else {
          uniqueSlugs[lang] = slug;
        }
        usedSlugs.add(uniqueSlugs[lang]);
      }
      
      console.log(`🔄 Generating slugs for Profile ${profile.id} (${profile.first_name}):`, uniqueSlugs);
      
      // Update profile with generated slugs
      await pool.query(`
        UPDATE profiles 
        SET slug_en = $1, slug_es = $2, slug_de = $3, slug_it = $4, slug_nl = $5, slug_pt = $6
        WHERE id = $7
      `, [uniqueSlugs.en, uniqueSlugs.es, uniqueSlugs.de, uniqueSlugs.it, uniqueSlugs.nl, uniqueSlugs.pt, profile.id]);
      
      console.log(`✅ Updated Profile ${profile.id} with unique multilingual slugs`);
    }
    
    console.log('🎉 SLUG MIGRATION COMPLETE - All profiles now have SEO-friendly URLs');
    
  } catch (error) {
    console.error('❌ SLUG MIGRATION ERROR:', error);
  } finally {
    await pool.end();
  }
}

// Run the migration
generateSlugsForExistingProfiles();