import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { X, Download, Share2 } from 'lucide-react';
import { getMediaUrl } from "@/lib/mediaUtils";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  profileName: string;
  videoIndex?: number;
  totalVideos?: number;
}

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoSrc, 
  profileName, 
  videoIndex = 0, 
  totalVideos = 1 
}: VideoModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileName}'s Video`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getMediaUrl(videoSrc, 'video');
    link.download = `${profileName}_video_${videoIndex + 1}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Modal Content */}
      <div className="relative w-full h-full max-w-4xl max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{profileName}'s Video</h3>
            {totalVideos > 1 && (
              <p className="text-sm text-gray-300">
                Video {videoIndex + 1} of {totalVideos}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleShare}
              size="sm"
              variant="ghost"
              className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleDownload}
              size="sm"
              variant="ghost"
              className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white hover:text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-3xl max-h-[80vh]">
            <VideoPlayer
              src={getMediaUrl(videoSrc, 'video')}
              className="w-full h-full rounded-lg"
              autoPlay={true}
              onError={(error) => {
                console.error('Video modal playback error:', error);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black bg-opacity-50 text-center">
          <p className="text-gray-300 text-sm">
            Press ESC to close • Click outside to close
          </p>
        </div>
      </div>

      {/* Background Click to Close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
}