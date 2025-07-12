import { db } from './db';
import { profiles } from '../shared/schema';
import { migrateLocalFileToGCS, getGCSPublicUrl } from './s3-config';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';

interface MediaFile {
  localPath: string;
  s3Key: string;
  contentType: string;
  profileId: number;
  type: 'image' | 'video';
}

// Scan uploads directory and prepare migration list
export async function scanLocalMedia(): Promise<MediaFile[]> {
  const mediaFiles: MediaFile[] = [];
  const uploadsDir = path.join(process.cwd(), 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found');
    return mediaFiles;
  }
  
  const imagesDir = path.join(uploadsDir, 'images');
  const videosDir = path.join(uploadsDir, 'videos');
  
  // Scan images
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir);
    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const contentType = mime.lookup(file) || 'application/octet-stream';
        mediaFiles.push({
          localPath: filePath,
          s3Key: `images/${file}`,
          contentType,
          profileId: 0, // Will be determined from filename or database
          type: 'image',
        });
      }
    }
  }
  
  // Scan videos
  if (fs.existsSync(videosDir)) {
    const videoFiles = fs.readdirSync(videosDir);
    for (const file of videoFiles) {
      const filePath = path.join(videosDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const contentType = mime.lookup(file) || 'application/octet-stream';
        mediaFiles.push({
          localPath: filePath,
          s3Key: `videos/${file}`,
          contentType,
          profileId: 0, // Will be determined from filename or database
          type: 'video',
        });
      }
    }
  }
  
  return mediaFiles;
}

// Migrate all local media files to S3
export async function migrateAllMediaToGCS(): Promise<void> {
  console.log('🚀 Starting media migration to Google Cloud Storage...');
  
  const mediaFiles = await scanLocalMedia();
  console.log(`Found ${mediaFiles.length} media files to migrate`);
  
  if (mediaFiles.length === 0) {
    console.log('No media files found to migrate');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const media of mediaFiles) {
    try {
      console.log(`Uploading ${media.localPath} to Google Cloud Storage...`);
      const gcsUrl = await migrateLocalFileToGCS(
        media.localPath,
        media.s3Key,
        media.contentType
      );
      
      console.log(`✅ Successfully uploaded: ${gcsUrl}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to upload ${media.localPath}:`, error);
      errorCount++;
    }
  }
  
  console.log(`🎉 Migration complete: ${successCount} successful, ${errorCount} errors`);
}

// Update database to use S3 URLs
export async function updateDatabaseUrls(): Promise<void> {
  console.log('🔄 Updating database URLs to use Google Cloud Storage...');
  
  const allProfiles = await db.select().from(profiles);
  console.log(`Found ${allProfiles.length} profiles to update`);
  
  for (const profile of allProfiles) {
    try {
      let updated = false;
      const updates: any = {};
      
      // Update photos array
      if (profile.photos && Array.isArray(profile.photos)) {
        const updatedPhotos = profile.photos.map((photo: string) => {
          if (photo.startsWith('/uploads/')) {
            const gcsKey = photo.replace('/uploads/', '');
            return getGCSPublicUrl(gcsKey);
          }
          return photo;
        });
        
        if (JSON.stringify(updatedPhotos) !== JSON.stringify(profile.photos)) {
          updates.photos = updatedPhotos;
          updated = true;
        }
      }
      
      // Update videos array
      if (profile.videos && Array.isArray(profile.videos)) {
        const updatedVideos = profile.videos.map((video: string) => {
          if (video.startsWith('/uploads/')) {
            const gcsKey = video.replace('/uploads/', '');
            return getGCSPublicUrl(gcsKey);
          }
          return video;
        });
        
        if (JSON.stringify(updatedVideos) !== JSON.stringify(profile.videos)) {
          updates.videos = updatedVideos;
          updated = true;
        }
      }
      
      if (updated) {
        await db.update(profiles)
          .set(updates)
          .where(eq(profiles.id, profile.id));
        
        console.log(`✅ Updated profile ${profile.id} (${profile.firstName})`);
      }
    } catch (error) {
      console.error(`❌ Failed to update profile ${profile.id}:`, error);
    }
  }
  
  console.log('🎉 Database URL update complete');
}

// Full migration process
export async function runFullMigration(): Promise<void> {
  console.log('🚀 Starting full media migration process...');
  
  try {
    // Step 1: Migrate files to Google Cloud Storage
    await migrateAllMediaToGCS();
    
    // Step 2: Update database URLs
    await updateDatabaseUrls();
    
    console.log('🎉 Full migration completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Verify all images load correctly on the site');
    console.log('   2. Test file uploads to ensure they go to S3');
    console.log('   3. Remove local uploads/ directory');
    console.log('   4. Deploy without media file concerns');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}