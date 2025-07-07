import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoModal } from "@/components/VideoModal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ArrowLeft, MessageCircle, Instagram, Mail, Shield, Zap, Lock, Phone, Send, Facebook, Video, Play, Maximize } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getMediaUrl } from "@/lib/mediaUtils";
import { addLanguageToPath, getCurrentLanguage } from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import SEO, { structuredDataSchemas } from "@/components/SEO";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const params = useParams<{ lang: string; id: string }>();
  const id = params.id;
  const currentLanguage = getCurrentLanguage();
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: [`/api/profiles/${id}`],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!profile) return;
    
    addItem({
      id: profile.id,
      name: `${profile.firstName}, ${profile.age}`,
      age: profile.age,
      location: profile.location,
      photo: profile.photos?.[0] || '',
      price: parseFloat(profile.price)
    });
    
    toast({
      title: t.addedToCart,
      description: `${profile.firstName}'s ${t.contactInfo} has been added to your cart.`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.profileNotFound}</h1>
          <p className="text-gray-600 mb-4">{t.profileNotFoundDesc}</p>
          <Link href={addLanguageToPath('/browse', currentLanguage)}>
            <Button>{t.backToBrowse}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        page="browse" 
        profileData={{
          name: profile.firstName,
          age: profile.age,
          location: profile.location,
          photos: profile.photos
        }}
        structuredData={{
          "@type": "Person",
          "name": profile.firstName,
          "age": profile.age,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "DO",
            "addressLocality": profile.location
          },
          "gender": "Female",
          "nationality": "Dominican"
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href={addLanguageToPath('/browse', currentLanguage)}>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToBrowse}
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Images Carousel */}
          <div className="space-y-4">
            {/* Combined Media Carousel (Photos + Videos) */}
            {((profile.photos && profile.photos.length > 0) || (profile.videos && profile.videos.length > 0)) ? (
              <Carousel className="w-full" setApi={setCarouselApi}>
                <CarouselContent>
                  {/* Photos */}
                  {profile.photos && profile.photos.map((photo, index) => (
                    <CarouselItem key={`photo-${index}`}>
                      <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg relative">
                        <img 
                          src={getMediaUrl(photo, 'image')}
                          alt={`${profile.firstName} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                              <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
                                <rect width="400" height="500" fill="#f3f4f6"/>
                                <circle cx="200" cy="200" r="50" fill="#d1d5db"/>
                                <path d="M150 300 L250 300 L230 350 L170 350 Z" fill="#d1d5db"/>
                                <text x="200" y="420" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Photo Preview</text>
                              </svg>
                            `)}`;
                          }}
                        />
                        <div className="absolute top-4 left-4 bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <span>📷</span>
                          <span>Photo</span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                  
                  {/* Videos */}
                  {profile.videos && profile.videos.map((video, index) => (
                    <CarouselItem key={`video-${index}`}>
                      <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg relative">
                        <VideoPlayer
                          src={getMediaUrl(video, 'video')}
                          poster={`data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
                              <rect width="400" height="500" fill="#1f2937"/>
                              <circle cx="200" cy="250" r="60" fill="#374151" stroke="#6b7280" stroke-width="3"/>
                              <polygon points="175,220 175,280 235,250" fill="#9ca3af"/>
                              <text x="200" y="350" text-anchor="middle" font-family="Arial" font-size="16" fill="#9ca3af">Video Preview</text>
                            </svg>
                          `)}`}
                          className="w-full h-full rounded-xl"
                          onError={(error) => {
                            console.error('Video playback error:', error);
                          }}
                        />
                        
                        <div className="absolute top-4 left-4 bg-purple-500 text-white text-sm px-2 py-1 rounded-full font-medium flex items-center gap-1 pointer-events-none z-10">
                          <span>🎥</span>
                          <span>Video</span>
                        </div>
                        
                        {/* Fullscreen Button */}
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedVideo(video);
                            setSelectedVideoIndex(index);
                            setVideoModalOpen(true);
                          }}
                          size="sm"
                          variant="ghost"
                          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70 z-10"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No media available</p>
              </div>
            )}
            
            {/* Media Thumbnails (Photos + Videos) */}
            {((profile.photos && profile.photos.length > 0) || (profile.videos && profile.videos.length > 0)) && 
             (profile.photos?.length + profile.videos?.length) > 1 && (
              <div className="space-y-2">
                <div className="text-center flex gap-2 justify-center">
                  {profile.photos && profile.photos.length > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {profile.photos.length} photo{profile.photos.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {profile.videos && profile.videos.length > 0 && (
                    <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-800">
                      {profile.videos.length} video{profile.videos.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {/* Photo Thumbnails */}
                  {profile.photos && profile.photos.slice(0, 6).map((photo, index) => (
                    <div key={`thumb-photo-${index}`} className="relative">
                      <img 
                        src={getMediaUrl(photo, 'image')}
                        alt={`${profile.firstName} photo ${index + 1}`}
                        className="w-full rounded-lg aspect-square object-cover hover:opacity-80 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                        onClick={() => carouselApi?.scrollTo(index)}
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
                              <rect width="150" height="150" fill="#f3f4f6"/>
                              <circle cx="75" cy="60" r="20" fill="#d1d5db"/>
                              <path d="M55 90 L95 90 L90 105 L60 105 Z" fill="#d1d5db"/>
                              <text x="75" y="130" text-anchor="middle" font-family="Arial" font-size="10" fill="#6b7280">Photo</text>
                            </svg>
                          `)}`;
                        }}
                      />
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        📷
                      </div>
                    </div>
                  ))}
                  
                  {/* Video Thumbnails */}
                  {profile.videos && profile.videos.slice(0, 8 - (profile.photos?.length || 0)).map((video, index) => (
                    <div key={`thumb-video-${index}`} className="relative group">
                      <div 
                        className="w-full rounded-lg aspect-square bg-gray-900 hover:opacity-80 hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer overflow-hidden"
                        onClick={() => carouselApi?.scrollTo((profile.photos?.length || 0) + index)}
                      >
                        <video 
                          src={getMediaUrl(video, 'video')}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                          poster={`data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
                              <rect width="150" height="150" fill="#1f2937"/>
                              <circle cx="75" cy="75" r="25" fill="#374151" stroke="#6b7280" stroke-width="2"/>
                              <polygon points="65,60 65,90 90,75" fill="#9ca3af"/>
                            </svg>
                          `)}`}
                        />
                        
                        {/* Hover Overlay with Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                carouselApi?.scrollTo((profile.photos?.length || 0) + index);
                              }}
                              size="sm"
                              variant="ghost"
                              className="bg-white bg-opacity-90 text-black hover:bg-opacity-100"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVideo(video);
                                setSelectedVideoIndex(index);
                                setVideoModalOpen(true);
                              }}
                              size="sm"
                              variant="ghost"
                              className="bg-white bg-opacity-90 text-black hover:bg-opacity-100"
                            >
                              <Maximize className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Default Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-200">
                          <div className="w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-1 left-1 bg-purple-500 text-white text-xs px-1 py-0.5 rounded">
                        🎥
                      </div>
                    </div>
                  ))}
                </div>
                {(profile.photos?.length + profile.videos?.length) > 8 && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      +{(profile.photos?.length + profile.videos?.length) - 8} more media
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.firstName} {profile.lastName && profile.lastName[0] + '.'}, {profile.age}
                    </h1>
                    <p className="text-gray-600 text-lg">{profile.location}</p>
                  </div>
                  <FavoriteHeart profileId={profile.id} size="lg" />
                </div>
                {profile.aboutMe && (
                  <p className="text-gray-700 mb-6">{profile.aboutMe}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Profile Details</h3>
                    <div className="space-y-2 text-sm">
                      {profile.height && (
                        <div><span className="font-medium">Height:</span> {profile.height}</div>
                      )}
                      {profile.occupation && (
                        <div><span className="font-medium">Profession:</span> {profile.occupation}</div>
                      )}
                      {profile.education && (
                        <div><span className="font-medium">Education:</span> {profile.education}</div>
                      )}
                      {profile.relationshipStatus && (
                        <div><span className="font-medium">Status:</span> {profile.relationshipStatus}</div>
                      )}
                      {profile.languages && (
                        <div><span className="font-medium">Languages:</span> {profile.languages.join(', ')}</div>
                      )}
                      {profile.children && (
                        <div><span className="font-medium">Children:</span> {profile.children}</div>
                      )}
                      {profile.smoking && (
                        <div><span className="font-medium">Smoking:</span> {profile.smoking}</div>
                      )}
                      {profile.drinking && (
                        <div><span className="font-medium">Drinking:</span> {profile.drinking}</div>
                      )}
                    </div>
                  </div>
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Available Contact Methods</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {profile.contactMethods?.whatsapp && (
                      <div className="text-center">
                        <div className="bg-green-100 text-green-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">WhatsApp</span>
                      </div>
                    )}
                    {profile.contactMethods?.instagram && (
                      <div className="text-center">
                        <div className="bg-pink-100 text-pink-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Instagram className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">Instagram</span>
                      </div>
                    )}
                    {profile.contactMethods?.email && (
                      <div className="text-center">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Mail className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">Email</span>
                      </div>
                    )}
                    {profile.contactMethods?.telegram && (
                      <div className="text-center">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Send className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">Telegram</span>
                      </div>
                    )}
                    {profile.contactMethods?.facebook && (
                      <div className="text-center">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Facebook className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">Facebook</span>
                      </div>
                    )}
                    {profile.contactMethods?.tiktok && (
                      <div className="text-center">
                        <div className="bg-black text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                          <Video className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-gray-600">TikTok</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 text-center">
                      <Shield className="inline h-4 w-4 text-blue-600 mr-2" />
                      Contact information is revealed after purchase and verified for authenticity
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Contact Pricing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Individual Contact</h4>
                        <div className="text-3xl font-bold text-primary mb-2">
                          ${profile.price}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">1-9 contacts</p>
                        <Button 
                          onClick={handleAddToCart}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Add to Cart
                        </Button>
                      </div>
                      
                      <div className="border-2 border-primary rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Bulk Discount</h4>
                        <div className="text-3xl font-bold text-primary mb-2">$1.00</div>
                        <p className="text-sm text-gray-600 mb-4">10+ contacts</p>
                        <Button 
                          onClick={handleAddToCart}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Lock className="h-4 w-4 text-blue-600 mr-1" />
                        Secure payment
                      </span>
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 text-yellow-600 mr-1" />
                        Instant delivery
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoSrc={selectedVideo}
        profileName={profile?.firstName || 'Profile'}
        videoIndex={selectedVideoIndex}
        totalVideos={profile?.videos?.length || 0}
      />
    </div>
  );
}
