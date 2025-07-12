import { Storage } from '@google-cloud/storage';
import multer from 'multer';

// Google Cloud Storage Configuration
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE, // Path to service account key file
  // Or use service account key directly
  credentials: process.env.GOOGLE_CLOUD_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS) : undefined,
});

const BUCKET_NAME = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'holacupid-media';

// Custom Multer Google Cloud Storage engine
class GoogleCloudStorageEngine {
  constructor(options: any) {
    this.bucket = storage.bucket(options.bucket);
    this.options = options;
  }

  _handleFile(req: any, file: any, cb: any) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.originalname.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    
    // Organize by type
    const folder = file.mimetype.startsWith('image/') ? 'images' : 'videos';
    const fullPath = `${folder}/${filename}`;
    
    const gcsFile = this.bucket.file(fullPath);
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true, // Make file publicly accessible
    });

    stream.on('error', (error: any) => {
      cb(error);
    });

    stream.on('finish', () => {
      cb(null, {
        bucket: this.bucket.name,
        key: fullPath,
        cloudStoragePublicUrl: `https://storage.googleapis.com/${this.bucket.name}/${fullPath}`,
        contentType: file.mimetype,
      });
    });

    file.stream.pipe(stream);
  }

  _removeFile(req: any, file: any, cb: any) {
    this.bucket.file(file.key).delete(cb);
  }
}

// Multer Google Cloud Storage Configuration for Direct Upload
export const gcsUpload = multer({
  storage: new GoogleCloudStorageEngine({
    bucket: BUCKET_NAME,
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  },
});

// Generate signed URL for secure access
export async function generateSignedUrl(filename: string, expiresIn: number = 3600): Promise<string> {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(filename);
  
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresIn * 1000,
  });
  
  return signedUrl;
}

// Get Google Cloud Storage URL for public access
export function getGCSPublicUrl(filename: string): string {
  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
}

// Upload existing local file to Google Cloud Storage
export async function uploadFileToGCS(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(filename);
  
  await file.save(fileBuffer, {
    metadata: {
      contentType: contentType,
    },
    public: true, // Make file publicly accessible
  });
  
  return getGCSPublicUrl(filename);
}

// Migration function to upload existing files
export async function migrateLocalFileToGCS(
  localPath: string,
  gcsFilename: string,
  contentType: string
): Promise<string> {
  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync(localPath)) {
    throw new Error(`Local file not found: ${localPath}`);
  }
  
  const fileBuffer = fs.readFileSync(localPath);
  return await uploadFileToGCS(fileBuffer, gcsFilename, contentType);
}

export { storage as gcsStorage, BUCKET_NAME };