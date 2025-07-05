#!/bin/bash
# Script to push HolaCupid project to GitHub

echo "Adding all files to git..."
git add .

echo "Creating commit..."
git commit -m "Initial commit: Complete HolaCupid dating platform with React frontend, Express backend, and PostgreSQL database"

echo "Adding GitHub remote..."
git remote add origin https://github.com/firnco-tech/ContactHarvest.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Check your GitHub repository."