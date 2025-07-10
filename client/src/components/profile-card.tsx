import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Play } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUtils";
import { addLanguageToPath, getCurrentLanguage } from "@/lib/i18n";

import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const currentLanguage = getCurrentLanguage();


  const isInCart = items.some(item => item.id === profile.id);

  // Get the appropriate slug for the current language with fallback to ID
  const getProfileSlug = () => {
    let slug;
    switch (currentLanguage) {
      case 'es': slug = profile.slugEs; break;
      case 'de': slug = profile.slugDe; break;
      case 'it': slug = profile.slugIt; break;
      case 'nl': slug = profile.slugNl; break;
      case 'pt': slug = profile.slugPt; break;
      default: slug = profile.slugEn; break;
    }
    // Fallback to profile ID if slug is not available
    return slug || profile.id.toString();
  };

  const profileSlug = getProfileSlug();

  const handleAddToCart = () => {
    if (isInCart) {
      return; // Don't add if already in cart
    }
    
    addItem({
      id: profile.id,
      name: `${profile.firstName}, ${profile.age}`,
      age: profile.age,
      location: profile.location,
      photo: profile.primaryPhoto || profile.photos?.[0] || '',
      price: parseFloat(profile.price)
    });
    
    toast({
      title: "Added to cart",
      description: `${profile.firstName}'s contact information has been added to your cart.`
    });
  };

  const primaryPhoto = profile.primaryPhoto || profile.photos?.[0];
  const imageUrl = primaryPhoto ? getMediaUrl(primaryPhoto, 'image') : null;
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development' && primaryPhoto) {
    console.log('ProfileCard Debug:', {
      profileId: profile.id,
      firstName: profile.firstName,
      primaryPhoto,
      imageUrl,
      photos: profile.photos
    });
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <Link href={addLanguageToPath(`/profile/${profileSlug}`, currentLanguage)}>
          <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
            <img 
              src={imageUrl || `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                  <rect width="300" height="400" fill="#f3f4f6"/>
                  <circle cx="150" cy="160" r="40" fill="#d1d5db"/>
                  <path d="M110 240 L190 240 L175 280 L125 280 Z" fill="#d1d5db"/>
                  <text x="150" y="320" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Profile Photo</text>
                </svg>
              `)}`}
              alt={`${profile.firstName} profile photo`}
              className="w-full h-full object-contain hover:scale-105 transition-transform"
              style={{ backgroundColor: '#f8fafc' }}
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
                    <rect width="300" height="400" fill="#f3f4f6"/>
                    <circle cx="150" cy="160" r="40" fill="#d1d5db"/>
                    <path d="M110 240 L190 240 L175 280 L125 280 Z" fill="#d1d5db"/>
                    <text x="150" y="320" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Profile Photo</text>
                  </svg>
                `)}`;
              }}
            />
            

          
          {/* Media Count Indicators */}
          <div className="absolute top-2 right-2 flex gap-1">
            {profile.photos && profile.photos.length > 0 && (
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span>📷</span>
                <span>{profile.photos.length}</span>
              </div>
            )}
            {profile.videos && profile.videos.length > 0 && (
              <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span>🎥</span>
                <span>{profile.videos.length}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Link href={addLanguageToPath(`/profile/${profileSlug}`, currentLanguage)}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary">
                {profile.firstName}, {profile.age}
              </h3>
            </Link>
            <p className="text-gray-600 mb-2">{profile.location}</p>
          </div>
          <FavoriteHeart profileId={profile.id} size="lg" />
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {profile.aboutMe || 'No description available'}
        </p>
        
        <div className="flex justify-end items-center">
          <Button 
            onClick={handleAddToCart}
            disabled={isInCart}
            className={isInCart 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-primary hover:bg-primary/90"
            }
          >
            {isInCart ? "IN CART" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
