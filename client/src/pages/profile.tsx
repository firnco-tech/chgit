import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, MessageCircle, Instagram, Mail, Shield, Zap, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

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
      title: "Added to cart",
      description: `${profile.firstName}'s contact information has been added to your cart.`
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or isn't available.</p>
          <Link href="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/browse">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Images Carousel */}
          <div className="space-y-4">
            {profile.photos && profile.photos.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {profile.photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                        <img 
                          src={photo.startsWith('data:') || photo.startsWith('http') 
                            ? photo 
                            : `https://picsum.photos/400/500?random=${profile.id + index}`}
                          alt={`${profile.firstName} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/400/500?random=${profile.id + index + 1000}`;
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No photos available</p>
              </div>
            )}
            
            {/* Photo Thumbnails */}
            {profile.photos && profile.photos.length > 1 && (
              <div className="space-y-2">
                <div className="text-center">
                  <Badge variant="secondary" className="text-sm">
                    {profile.photos.length} photos
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {profile.photos.slice(0, 8).map((photo, index) => (
                    <img 
                      key={index}
                      src={photo.startsWith('data:') || photo.startsWith('http') 
                        ? photo 
                        : `https://picsum.photos/150/150?random=${profile.id + index + 100}`}
                      alt={`${profile.firstName} photo ${index + 1}`}
                      className="w-full rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/150/150?random=${profile.id + index + 2000}`;
                      }}
                    />
                  ))}
                </div>
                {profile.photos.length > 8 && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      +{profile.photos.length - 8} more photos
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.firstName} {profile.lastName && profile.lastName[0] + '.'}, {profile.age}
                </h1>
                <p className="text-gray-600 text-lg mb-4">{profile.location}</p>
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
    </div>
  );
}
