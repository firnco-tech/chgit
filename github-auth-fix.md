# Fix GitHub Authentication Issue

## Problem
Replit cannot authenticate with GitHub repository due to missing access token.

## Solution Steps

### 1. Generate GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Replit HolaCupid"
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 2. Configure Git Remote with Token
In your Replit Console, run:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/firnco-tech/ContactHarvest.git
```

Replace `YOUR_TOKEN` with the actual token you copied.

### 3. Test the Connection
```bash
git push -u origin main
```

## Alternative: Make Repository Public
If you want to keep it simple:
1. Go to your GitHub repository settings
2. Scroll to "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Then run: `git push -u origin main`

## Your Repository
https://github.com/firnco-tech/ContactHarvest

Once authentication is fixed, your complete HolaCupid platform will be backed up to GitHub!