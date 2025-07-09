import React, { useState, useEffect } from 'react';
import { X, Maximize2 } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOriginalToggle = () => {
    if (!showOriginal && originalSrc) {
      setIsLoading(true);
    }
    setShowOriginal(!showOriginal);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-75 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {profileName && (
              <span className="text-white text-sm font-medium">{profileName}</span>
            )}
            {showOriginal && (
              <span className="text-green-400 text-sm bg-green-900 bg-opacity-50 px-2 py-1 rounded">
                Original Image
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
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
        <div className="relative flex-1 bg-black rounded-b-lg overflow-auto" style={{ maxHeight: '75vh' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading original image...</p>
              </div>
            </div>
          )}
          
          <img
            src={showOriginal && originalSrc ? originalSrc : src}
            alt={alt}
            className="w-full h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
        
        {/* Footer with image info */}
        <div className="p-3 bg-black bg-opacity-75 rounded-b-lg">
          <p className="text-white text-sm text-center">
            {showOriginal ? 'Original, unmodified image' : 'Optimized for web display'}
          </p>
        </div>
      </div>
    </div>
  );
}