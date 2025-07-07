/**
 * SLUG MIGRATION SCRIPT
 * Generates multilingual SEO slugs for all existing profiles
 */

const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure neon for serverless
const { neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = ws;

// Inline slug utilities for CommonJS compatibility
function normalizeForSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateMultilingualSlugs(data) {
  const { firstName, location } = data;
  const normalizedFirstName = normalizeForSlug(firstName);
  
  const locationTranslations = {
    'Santiago': 'santiago',
    'Santo Domingo': 'santo-domingo',
    'La Romana': 'la-romana',
    'San Pedro de Macorís': 'san-pedro-de-macoris',
    'Puerto Plata': 'puerto-plata'
  };
  
  const countryTranslations = {
    en: 'dominican-republic',
    es: 'republica-dominicana', 
    de: 'dominikanische-republik',
    it: 'repubblica-dominicana',
    nl: 'dominicaanse-republiek',
    pt: 'republica-dominicana'
  };
  
  const fromPrepositions = {
    en: 'from',
    es: 'de',
    de: 'aus', 
    it: 'da',
    nl: 'uit',
    pt: 'de'
  };
  
  const getLocationSlug = (location) => {
    return locationTranslations[location] || normalizeForSlug(location);
  };
  
  const slugs = {};
  const languages = ['en', 'es', 'de', 'it', 'nl', 'pt'];
  
  for (const lang of languages) {
    const fromPreposition = fromPrepositions[lang];
    const locationSlug = getLocationSlug(location);
    const countrySlug = countryTranslations[lang];
    
    slugs[lang] = `${normalizedFirstName}-${fromPreposition}-${locationSlug}-${countrySlug}`;
  }
  
  return slugs;
}

function ensureUniqueSlug(baseSlug, existingSlugs, maxAttempts = 100) {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  for (let i = 2; i <= maxAttempts; i++) {
    const candidateSlug = `${baseSlug}-${i}`;
    if (!existingSlugs.includes(candidateSlug)) {
      return candidateSlug;
    }
  }
  
  return `${baseSlug}-${Date.now()}`;
}

async function generateSlugsForExistingProfiles() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('🔄 Starting slug generation for existing profiles...');
    
    // Get all profiles that need slugs
    const result = await pool.query(
      'SELECT id, first_name, location FROM profiles WHERE slug_en IS NULL'
    );
    
    const profiles = result.rows;
    console.log(`📋 Found ${profiles.length} profiles needing slugs`);
    
    if (profiles.length === 0) {
      console.log('✅ All profiles already have slugs generated');
      return;
    }
    
    // Track existing slugs to ensure uniqueness
    const existingSlugs = {
      en: new Set(),
      es: new Set(),
      de: new Set(),
      it: new Set(),
      nl: new Set(),
      pt: new Set()
    };
    
    // Get existing slugs
    const existingResult = await pool.query(
      'SELECT slug_en, slug_es, slug_de, slug_it, slug_nl, slug_pt FROM profiles WHERE slug_en IS NOT NULL'
    );
    
    existingResult.rows.forEach(row => {
      if (row.slug_en) existingSlugs.en.add(row.slug_en);
      if (row.slug_es) existingSlugs.es.add(row.slug_es);
      if (row.slug_de) existingSlugs.de.add(row.slug_de);
      if (row.slug_it) existingSlugs.it.add(row.slug_it);
      if (row.slug_nl) existingSlugs.nl.add(row.slug_nl);
      if (row.slug_pt) existingSlugs.pt.add(row.slug_pt);
    });
    
    console.log('📊 Existing slugs loaded for uniqueness checking');
    
    // Process each profile
    for (const profile of profiles) {
      try {
        console.log(`🔧 Processing profile ${profile.id}: ${profile.first_name} from ${profile.location}`);
        
        // Generate base slugs
        const baseSlugs = generateMultilingualSlugs({
          firstName: profile.first_name,
          location: profile.location,
          id: profile.id
        });
        
        // Ensure uniqueness for each language
        const uniqueSlugs = {};
        const languages = ['en', 'es', 'de', 'it', 'nl', 'pt'];
        
        for (const lang of languages) {
          const baseSlug = baseSlugs[lang];
          const uniqueSlug = ensureUniqueSlug(baseSlug, Array.from(existingSlugs[lang]));
          uniqueSlugs[lang] = uniqueSlug;
          existingSlugs[lang].add(uniqueSlug);
        }
        
        // Update database
        await pool.query(
          `UPDATE profiles 
           SET slug_en = $1, slug_es = $2, slug_de = $3, slug_it = $4, slug_nl = $5, slug_pt = $6 
           WHERE id = $7`,
          [
            uniqueSlugs.en,
            uniqueSlugs.es, 
            uniqueSlugs.de,
            uniqueSlugs.it,
            uniqueSlugs.nl,
            uniqueSlugs.pt,
            profile.id
          ]
        );
        
        console.log(`✅ Generated slugs for ${profile.first_name}:`);
        console.log(`   EN: ${uniqueSlugs.en}`);
        console.log(`   ES: ${uniqueSlugs.es}`);
        console.log(`   DE: ${uniqueSlugs.de}`);
        console.log(`   IT: ${uniqueSlugs.it}`);
        console.log(`   NL: ${uniqueSlugs.nl}`);
        console.log(`   PT: ${uniqueSlugs.pt}`);
        
      } catch (error) {
        console.error(`❌ Error processing profile ${profile.id}:`, error.message);
      }
    }
    
    console.log('🎉 Slug generation completed successfully!');
    
    // Verify results
    const verifyResult = await pool.query(
      'SELECT COUNT(*) as total, COUNT(slug_en) as with_slugs FROM profiles'
    );
    
    const { total, with_slugs } = verifyResult.rows[0];
    console.log(`📈 Verification: ${with_slugs}/${total} profiles now have slugs`);
    
  } catch (error) {
    console.error('❌ Slug generation failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
if (require.main === module) {
  generateSlugsForExistingProfiles()
    .then(() => {
      console.log('🏁 Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { generateSlugsForExistingProfiles };