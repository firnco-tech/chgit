#!/usr/bin/env tsx
/**
 * Media Migration Script - Migrate existing media files to S3
 * This script will upload all local media files to S3 and update database URLs
 */

import { runFullMigration } from './server/media-migration';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🚀 Starting HolaCupid Media Migration to S3...');
  
  // Check if S3 is configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
    console.error('❌ S3 configuration missing!');
    console.error('Please set the following environment variables:');
    console.error('   - AWS_ACCESS_KEY_ID');
    console.error('   - AWS_SECRET_ACCESS_KEY');
    console.error('   - AWS_S3_BUCKET_NAME');
    console.error('   - AWS_REGION (optional, defaults to us-east-1)');
    process.exit(1);
  }
  
  console.log('✅ S3 configuration found');
  console.log('📡 Bucket:', process.env.AWS_S3_BUCKET_NAME);
  console.log('🌍 Region:', process.env.AWS_REGION || 'us-east-1');
  
  try {
    await runFullMigration();
    console.log('🎉 Migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Verify all images load correctly on the website');
    console.log('   2. Test new file uploads to ensure they go to S3');
    console.log('   3. Remove local uploads/ directory after verification');
    console.log('   4. Deploy without worrying about media files');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main().catch(console.error);