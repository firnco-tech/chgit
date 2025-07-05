# Git Setup Instructions for ContactHarvest

## Step 1: Access Your Project
1. Click on "ContactHarvest" in your Apps list (visible in the screenshot)
2. This will open your actual project workspace

## Step 2: Find the Shell/Console
Once inside your ContactHarvest project, look for:
- A "Shell" tab
- A "Console" tab  
- A terminal icon (>_)
- Or check the bottom panel for a command line interface

## Step 3: Run Git Commands
In the Shell/Console, run these commands one by one:

```bash
# Connect to your GitHub repository
git remote add origin https://github.com/firnco-tech/ContactHarvest.git

# Add all your files
git add .

# Commit your HolaCupid platform
git commit -m "Complete HolaCupid dating platform

- React frontend with profile browsing
- Express backend with PostgreSQL  
- Stripe payment integration
- Submit profile form matching original design
- All features working and tested"

# Push to GitHub
git push -u origin main
```

## If Git Commands Don't Work
If you get permission errors, try:
```bash
# Run the setup script we created
./setup-git.sh
```

## What This Does
- Connects your working HolaCupid platform to GitHub
- Backs up all your code safely
- Makes your repository available at: https://github.com/firnco-tech/ContactHarvest

Your platform is fully functional - we just need to get it saved to GitHub!