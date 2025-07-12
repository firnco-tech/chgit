#!/usr/bin/env tsx
/**
 * Media Migration Script - Migrate existing media files to Google Cloud Storage
 * This script will upload all local media files to GCS and update database URLs
 */

import { runFullMigration } from './server/media-migration';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🚀 Starting HolaCupid Media Migration to Google Cloud Storage...');
  
  // Check if Google Cloud Storage is configured
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID || !process.env.GOOGLE_CLOUD_BUCKET_NAME || 
      (!process.env.GOOGLE_CLOUD_KEY_FILE && !process.env.GOOGLE_CLOUD_CREDENTIALS)) {
    console.error('❌ Google Cloud Storage configuration missing!');
    console.error('Please set the following environment variables:');
    console.error('   - GOOGLE_CLOUD_PROJECT_ID');
    console.error('   - GOOGLE_CLOUD_BUCKET_NAME');
    console.error('   - GOOGLE_CLOUD_CREDENTIALS (JSON string) OR GOOGLE_CLOUD_KEY_FILE (path to key file)');
    process.exit(1);
  }
  
  console.log('✅ Google Cloud Storage configuration found');
  console.log('📡 Project:', process.env.GOOGLE_CLOUD_PROJECT_ID);
  console.log('📦 Bucket:', process.env.GOOGLE_CLOUD_BUCKET_NAME);
  
  try {
    await runFullMigration();
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Verify all images load correctly on the website');
    console.log('   2. Test new file uploads to ensure they go to Google Cloud Storage');
    console.log('   3. Remove local uploads/ directory after verification');
    console.log('   4. Deploy without worrying about media files');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main().catch(console.error);