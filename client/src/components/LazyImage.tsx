/**
 * LAZY LOADING IMAGE COMPONENT
 * 
 * Performance-optimized image component with:
 * - Intersection Observer API for lazy loading
 * - Progressive image loading with blur effect
 * - WebP format support with fallbacks
 * - Core Web Vitals optimization
 */

import { useState, useRef, useEffect } from 'react';
import { analytics } from './Analytics';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate WebP source with fallback
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const isWebPSupported = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
    
    // Track successful image loads for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'image_load_success', {
        event_category: 'Performance',
        event_action: 'Image Loaded',
        image_src: src,
      });
    }
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    onError?.();
    
    // Track image load errors
    analytics.error(`Image load failed: ${src}`, window.location.pathname);
  };

  // Generate placeholder blur effect
  const placeholderStyle = placeholder ? {
    backgroundImage: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    transform: 'scale(1.1)'
  } : {
    backgroundColor: '#f3f4f6'
  };

  // Error fallback image
  const errorFallback = (
    <div 
      className={`flex items-center justify-center bg-gray-100 ${className}`}
      style={{ width, height }}
    >
      <svg 
        className="w-12 h-12 text-gray-400"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  );

  if (hasError) {
    return errorFallback;
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder/blur effect */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={placeholderStyle}
        />
      )}
      
      {/* Actual image - only load when in view */}
      {isInView && (
        <picture>
          {/* WebP format for modern browsers */}
          {isWebPSupported() && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          
          {/* Fallback format */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              aspectRatio: width && height ? `${width}/${height}` : undefined
            }}
          />
        </picture>
      )}
      
      {/* Loading spinner */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Higher-order component for profile images with specific optimizations
export function ProfileImage({
  src,
  alt,
  className = '',
  priority = false,
  ...props
}: LazyImageProps) {
  // Generate placeholder for profile images
  const generatePlaceholder = (originalSrc: string) => {
    // Create a tiny placeholder (could be generated server-side)
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ec4899'; // Primary color
      ctx.fillRect(0, 0, 10, 10);
    }
    return canvas.toDataURL();
  };

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      placeholder={generatePlaceholder(src)}
      {...props}
    />
  );
}

export default LazyImage;