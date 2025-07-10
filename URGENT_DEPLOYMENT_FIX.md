# URGENT: Stop Media File Deletion During Deployments

## THE PROBLEM
Your development environment connects to the live production database but overwrites the `/uploads/` directory during deployments, deleting all user-uploaded media files.

## IMMEDIATE SOLUTION

### 1. .gitignore Already Updated
The `uploads/` directory is now excluded from version control:
```
uploads/
```

### 2. Replit Deployment Settings
**CRITICAL ACTION REQUIRED:**
1. Go to your Replit project settings
2. Find "Deployment" or "Build" settings
3. Add `uploads/` to the "Ignore Paths" or "Exclude Files" list
4. This prevents Replit from overwriting the uploads directory during deployments

### 3. Manual Verification
Before any deployment:
```bash
# Check that uploads is in .gitignore
grep "uploads/" .gitignore

# Verify uploads directory exists on production
ls -la /production/uploads/
```

### 4. Emergency Recovery Process
If media files are deleted again:
1. **DO NOT DEPLOY ANYTHING**
2. Restore from backup: `uploads_backup.tar.gz`
3. Extract directly to production server: `tar -xzf uploads_backup.tar.gz -C /production/`

## ROOT CAUSE & PERMANENT FIX
The issue is architectural - media files should never be stored in the application filesystem:

### Recommended Solution: Cloud Storage
1. **Use AWS S3, Google Cloud Storage, or similar**
2. **Store media URLs in database, not file paths**
3. **Both dev and production use same storage bucket**
4. **Deployments never touch media files**

### Quick Migration Plan:
1. Upload all existing media files to cloud storage
2. Update database to use cloud URLs instead of local paths
3. Update upload endpoint to save directly to cloud storage
4. Remove local uploads directory completely

## IMMEDIATE NEXT STEPS
1. **Stop all deployments** until this is fixed
2. **Configure Replit to ignore uploads/** in deployment settings
3. **Test deployment process** on a staging environment first
4. **Consider migrating to cloud storage** for permanent solution

## VERIFICATION
After implementing these changes:
- Development environment serves restored media for testing
- Production deployments skip uploads directory
- Live media files remain untouched
- No more media deletion incidents