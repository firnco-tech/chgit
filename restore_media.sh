#!/bin/bash
# Quick media restoration script for HolaCupid
# This script will prepare the uploads directory for deployment

echo "Creating media restoration package..."
cd uploads
zip -r ../media_restore.zip images/ videos/
cd ..
echo "Media package created: media_restore.zip"
echo "Total files: $(find uploads -type f | wc -l)"
echo "Package size: $(du -sh media_restore.zip)"