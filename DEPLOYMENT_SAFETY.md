# DEPLOYMENT SAFETY PROTOCOL

## CRITICAL: Media File Protection

### The Problem
- Development environment connects to live production database
- Media files are stored on production server filesystem in `/uploads/` directory
- Deployment process overwrites `/uploads/` with development version
- This deletes all live user-uploaded media files

### SOLUTION: Deployment Exclusion Rules

#### 1. .gitignore Configuration
The `/uploads/` directory is excluded from version control and deployments.

#### 2. Replit Deployment Settings
When deploying via Replit:
- The `uploads/` directory will NOT be included in deployments
- Existing media files on production server remain untouched
- Only code changes are deployed

#### 3. Manual Deployment Protocol
If deploying manually:
```bash
# NEVER run these commands on production:
# rm -rf uploads/
# cp -r uploads/ /production/uploads/

# ONLY deploy code files:
rsync -av --exclude='uploads/' --exclude='node_modules/' ./ production_server:/app/
```

#### 4. Environment Separation
- Development: Uses restored media files for testing
- Production: Uses live user-uploaded media files
- NO cross-contamination between environments

### VERIFICATION CHECKLIST
Before any deployment:
- [ ] Verify `uploads/` is in .gitignore
- [ ] Confirm deployment excludes `uploads/` directory
- [ ] Test deployment process in staging environment first
- [ ] Backup production media files before deployment

### EMERGENCY RECOVERY
If media files are accidentally deleted:
1. Stop all deployments immediately
2. Restore from backup: `uploads_backup.tar.gz`
3. Verify media files are accessible
4. Review deployment process to prevent recurrence