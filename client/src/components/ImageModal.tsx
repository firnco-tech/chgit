import React, { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Maximize, Plus, Minus, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  originalSrc?: string;
  profileName?: string;
}

export function ImageModal({ isOpen, onClose, src, alt, originalSrc, profileName }: ImageModalProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setZoom(1);
      setIsFullscreen(false);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', checkMobile);
    };
  }, [isOpen, onClose, isFullscreen]);

  const handleOriginalToggle = () => {
    if (!showOriginal && originalSrc) {
      setIsLoading(true);
    }
    setShowOriginal(!showOriginal);
  };

  const enterFullscreen = async () => {
    if (modalRef.current && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };



  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${isFullscreen ? 'bg-opacity-100' : 'bg-opacity-90'}`}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-[90vw] max-h-[90vh]'} flex flex-col overflow-hidden`}>
        {/* Header with controls */}
        <div className={`flex items-center justify-between p-4 bg-black bg-opacity-75 ${isFullscreen ? 'fixed top-0 left-0 right-0 z-20' : 'rounded-t-lg'}`}>
          <div className="flex items-center space-x-2">
            {profileName && (
              <span className="text-white text-sm font-medium">{profileName}</span>
            )}
            {showOriginal && (
              <span className="text-green-400 text-sm bg-green-900 bg-opacity-50 px-2 py-1 rounded">
                Original Image
              </span>
            )}
            {zoom !== 1 && (
              <span className="text-blue-400 text-sm bg-blue-900 bg-opacity-50 px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Zoom controls (desktop only) */}
            {!isMobile && (
              <>
                <Button
                  onClick={handleZoomOut}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  disabled={zoom <= 0.5}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleZoomReset}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-2"
                  title="Reset Zoom"
                >
                  1:1
                </Button>
                <Button
                  onClick={handleZoomIn}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  disabled={zoom >= 3}
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Original image toggle */}
            {originalSrc && (
              <Button
                onClick={handleOriginalToggle}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20"
                disabled={isLoading}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {showOriginal ? 'View Optimized' : 'View Original'}
              </Button>
            )}
            
            {/* Fullscreen toggle */}
            <Button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Maximize className="h-4 w-4" />
            </Button>
            
            {/* Close button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Image container */}
        <div 
          className={`relative flex-1 bg-black overflow-auto ${isFullscreen ? 'pt-16' : 'rounded-b-lg'}`} 
          style={{ maxHeight: isFullscreen ? '100vh' : '75vh' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading original image...</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center min-h-full">
            <img
              ref={imageRef}
              src={showOriginal && originalSrc ? originalSrc : src}
              alt={alt}
              className={`max-w-full max-h-full object-contain transition-transform duration-200 ${isMobile ? 'w-full h-full' : ''}`}
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center'
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </div>
        
        {/* Footer with image info */}
        {!isFullscreen && (
          <div className="p-3 bg-black bg-opacity-75 rounded-b-lg">
            <p className="text-white text-sm text-center">
              {showOriginal ? 'Original, unmodified image' : 'Optimized for web display'}
              {zoom !== 1 && ` • ${Math.round(zoom * 100)}% zoom`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}