/**
 * Media utilities for handling image and video URLs across the application
 */

/**
 * Convert a photo path to a proper URL
 * Handles: HTTP URLs, upload URLs, UUID filenames, and fallbacks
 */
export function getMediaUrl(path: string, type: 'image' | 'video' = 'image'): string {
  if (!path || path.trim() === '') {
    return '';
  }

  // If it's already a full URL (starts with http), use as-is
  if (path.startsWith('http')) {
    return path;
  }

  // If it's an upload URL (starts with /uploads/), use as-is
  if (path.startsWith('/uploads/')) {
    return path;
  }

  // For UUID filenames, construct the upload URL
  const isImage = path.match(/^[a-f0-9\-]{36}\.(jpg|jpeg|png|gif|webp)$/i);
  const isVideo = path.match(/^[a-f0-9\-]{36}\.(mp4|mov|avi|webm)$/i);
  
  if (isImage) {
    return `/uploads/images/${path}`;
  }
  
  if (isVideo) {
    return `/uploads/videos/${path}`;
  }

  // If type is specified and path looks like a filename, try to construct URL
  if (type === 'image' && path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return `/uploads/images/${path}`;
  }
  
  if (type === 'video' && path.match(/\.(mp4|mov|avi|webm)$/i)) {
    return `/uploads/videos/${path}`;
  }

  // Fallback: return the path as-is and let the browser handle it
  return path;
}

/**
 * Check if a URL/path is a valid image
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for HTTP URLs
  if (url.startsWith('http')) return true;
  
  // Check for upload URLs
  if (url.startsWith('/uploads/images/')) return true;
  
  // Check for image file extensions
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

/**
 * Check if a URL/path is a valid video
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for HTTP URLs (could be video)
  if (url.startsWith('http')) return true;
  
  // Check for upload URLs
  if (url.startsWith('/uploads/videos/')) return true;
  
  // Check for video file extensions
  return /\.(mp4|mov|avi|webm)$/i.test(url);
}

/**
 * Get thumbnail or fallback image for profile display
 */
export function getProfileImageUrl(photos: string[] | null | undefined, fallbackId?: number): string {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return '';
  }

  const firstPhoto = photos[0];
  const mediaUrl = getMediaUrl(firstPhoto, 'image');
  
  // If we have a valid media URL, return it
  if (mediaUrl && mediaUrl !== firstPhoto) {
    return mediaUrl;
  }

  // If it's already a valid HTTP URL, return it
  if (firstPhoto.startsWith('http')) {
    return firstPhoto;
  }

  // If we have a fallbackId, generate a placeholder
  if (fallbackId) {
    return `https://picsum.photos/400/500?random=${fallbackId}`;
  }

  return '';
}