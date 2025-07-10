#!/bin/bash

# CRITICAL: Media Restoration Script for Development Environment
# This script restores media files to development environment for testing

echo "🔄 MEDIA RESTORATION: Development Environment"
echo "⚠️  This script will restore media files from backup to development environment"
echo "⚠️  This is SAFE - it only affects the development environment"
echo ""

# Check if backup exists
if [ -f "uploads_backup.tar.gz" ]; then
    echo "✅ Found uploads_backup.tar.gz"
    
    # Create uploads directories if they don't exist
    mkdir -p uploads/images
    mkdir -p uploads/videos
    
    # Extract backup
    echo "🔄 Extracting media files from backup..."
    tar -xzf uploads_backup.tar.gz
    
    # Show what was restored
    echo "📊 MEDIA RESTORATION SUMMARY:"
    echo "   Images restored: $(find uploads/images -type f | wc -l)"
    echo "   Videos restored: $(find uploads/videos -type f | wc -l)"
    echo "   Total files: $(find uploads -type f | wc -l)"
    
    # Test a few sample files
    echo ""
    echo "🔍 TESTING SAMPLE FILES:"
    sample_files=("7z2g2SNwGb16CPa0VejTN.PNG" "Iu8429CRu1WBfZaLxJ3iX.jpg" "H7BJLrkakSMyH1_q_PovU.jpg")
    
    for file in "${sample_files[@]}"; do
        if [ -f "uploads/images/$file" ]; then
            echo "   ✅ $file - EXISTS"
        else
            echo "   ❌ $file - MISSING"
        fi
    done
    
    echo ""
    echo "✅ MEDIA RESTORATION COMPLETE"
    echo "🔄 Please refresh the browser to see restored images"
    
else
    echo "❌ ERROR: uploads_backup.tar.gz not found"
    echo "❌ Cannot restore media files without backup"
    exit 1
fi