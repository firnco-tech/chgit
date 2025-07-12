# Google Cloud Storage Setup Instructions

## Step 1: Create Google Cloud Project & Storage Bucket

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select existing project
3. Note your Project ID (e.g., "holacupid-media-storage")

### 1.2 Create Storage Bucket
1. Navigate to Cloud Storage → Buckets
2. Click "Create Bucket"
3. Choose bucket name: `holacupid-media` (or any unique name)
4. Choose region: `us-central1` (or closest to your users)
5. Set Access Control: **Fine-grained** (important for public access)
6. Click "Create"

### 1.3 Make Bucket Public (Required for Website Access)
1. Go to your bucket → Permissions tab
2. Click "Grant Access"
3. Add principal: `allUsers`
4. Select role: **Storage Object Viewer**
5. Click "Save"

## Step 2: Create Service Account & Credentials

### 2.1 Create Service Account
1. Go to IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Name: `holacupid-storage`
4. Description: `Storage access for HolaCupid media files`
5. Click "Create and Continue"

### 2.2 Assign Permissions
1. Select role: **Storage Admin** (full bucket access)
2. Click "Continue" → "Done"

### 2.3 Generate Key File
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select **JSON** format
5. Download the key file

## Step 3: Environment Variables

You need to provide these environment variables:

### Required Variables:
- **GOOGLE_CLOUD_PROJECT_ID**: Your project ID (e.g., "holacupid-media-storage")
- **GOOGLE_CLOUD_BUCKET_NAME**: Your bucket name (e.g., "holacupid-media")
- **GOOGLE_CLOUD_CREDENTIALS**: The entire JSON content of the downloaded key file

### Example JSON Credentials Format:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "holacupid-storage@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

## Step 4: Migration Process

Once credentials are provided:
1. **Upload existing media** to Google Cloud Storage
2. **Update database URLs** to use Google Cloud Storage URLs
3. **Configure new uploads** to go directly to Google Cloud Storage
4. **Remove local uploads directory** completely

## Benefits:
- **No more media deletion** during deployments
- **Global CDN** for fast media delivery
- **Unlimited storage** with pay-as-you-use pricing
- **Automatic backup** and redundancy
- **Works with both** development and production environments

## Pricing:
- Storage: ~$0.02/GB/month
- Bandwidth: ~$0.08-0.12/GB (first 1GB free monthly)
- Operations: ~$0.004 per 1000 operations

For a typical dating site with ~100GB media: **~$2-5/month**