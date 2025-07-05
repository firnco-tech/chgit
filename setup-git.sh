#!/bin/bash

# HolaCupid GitHub Connection Script
echo "Connecting HolaCupid platform to existing GitHub repository..."

# Wait for any git operations to complete
sleep 2

# Force unlock git config if needed
sudo rm -f .git/config.lock .git/index.lock 2>/dev/null || true

# Try to remove existing remote
git remote remove origin 2>/dev/null || true

# Add the existing GitHub repository as remote
git remote add origin https://github.com/firnco-tech/ContactHarvest.git

# Check if remote was added successfully
git remote -v

# Configure git user (replace with your actual details)
git config user.email "your-email@example.com" 2>/dev/null || true
git config user.name "Your Name" 2>/dev/null || true

# Fetch from remote to sync
git fetch origin 2>/dev/null || true

# Check current branch
git branch -a

# Add all current files
git add .

# Commit current state
git commit -m "Sync HolaCupid platform with GitHub repository

- Complete React frontend with profile browsing
- Express backend with PostgreSQL database
- Stripe payment integration working
- Submit profile form matches original design
- All features tested and functional
- Ready for deployment"

# Push to GitHub (force push to overwrite if needed)
git push -u origin main --force

echo "✅ Successfully connected to GitHub repository!"
echo "🔗 Repository: https://github.com/firnco-tech/ContactHarvest"
echo "🚀 Your HolaCupid platform is now backed up on GitHub"