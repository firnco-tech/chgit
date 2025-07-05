#!/bin/bash

# HolaCupid GitHub Setup Script
echo "Setting up Git for HolaCupid platform..."

# Remove any lock files that might be causing issues
rm -f .git/config.lock .git/index.lock 2>/dev/null || true

# Configure git if not already done
git config --global user.email "you@example.com" 2>/dev/null || true
git config --global user.name "Your Name" 2>/dev/null || true

# Add remote origin
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/firnco-tech/ContactHarvest.git

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: HolaCupid dating platform

- Complete React frontend with TypeScript
- Express backend with PostgreSQL
- Stripe payment integration
- Profile browsing and cart functionality
- Submit profile form matching original design
- All core features implemented and working"

# Push to GitHub
git push -u origin main

echo "Done! Your HolaCupid platform should now be on GitHub."
echo "Repository: https://github.com/firnco-tech/ContactHarvest"