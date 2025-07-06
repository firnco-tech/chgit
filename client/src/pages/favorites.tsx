/**
 * FAVORITES PAGE - View user's saved favorite profiles
 * 
 * This page displays all profiles that the authenticated user has favorited.
 * Requires user authentication to access.
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Eye, ShoppingCart, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface FavoriteProfile {
  id: number;
  userId: number;
  profileId: number;
  createdAt: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    location: string;
    photos: string[];
    price: string;
    aboutMe: string;
    occupation: string;
    isApproved: boolean;
    isFeatured: boolean;
  };
}

export default function Favorites() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to view your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/");
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast, setLocation]);

  // Fetch user favorites
  const { data: favorites = [], isLoading, error } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (profileId: number) => {
      return apiRequest(`/api/favorites/${profileId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${profileId}/status`] });
      toast({
        title: "Removed from favorites",
        description: "Profile has been removed from your favorites.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const handleViewProfile = (profileId: number) => {
    setLocation(`/profile/${profileId}`);
  };

  const handleRemoveFavorite = (profileId: number) => {
    removeFavoriteMutation.mutate(profileId);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Component will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            Your saved profiles and connections. {favorites.length} profile{favorites.length !== 1 ? 's' : ''} saved.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading favorites. Please try again.</p>
          </div>
        ) : favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No favorites yet</CardTitle>
              <CardDescription className="mb-6">
                Start browsing profiles and click the heart icon to save your favorites here.
              </CardDescription>
              <Button onClick={() => setLocation("/browse")}>
                Browse Profiles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite: FavoriteProfile) => (
              <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="relative">
                    {/* Profile Image */}
                    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-200 mb-4">
                      {favorite.profile.photos && favorite.profile.photos.length > 0 ? (
                        <img 
                          src={favorite.profile.photos[0]} 
                          alt={`${favorite.profile.firstName} ${favorite.profile.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                          <span className="text-4xl font-medium text-pink-600">
                            {favorite.profile.firstName?.[0] || 'P'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {favorite.profile.isFeatured && (
                        <Badge variant="default" className="bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                      <Badge variant={favorite.profile.isApproved ? "default" : "secondary"}>
                        {favorite.profile.isApproved ? "Verified" : "Pending"}
                      </Badge>
                    </div>

                    {/* Remove from favorites button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 left-2"
                      onClick={() => handleRemoveFavorite(favorite.profile.id)}
                      disabled={removeFavoriteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardTitle className="text-xl">
                    {favorite.profile.firstName} {favorite.profile.lastName}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{favorite.profile.age} years old</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{favorite.profile.location}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* About Me */}
                  {favorite.profile.aboutMe && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {favorite.profile.aboutMe}
                    </p>
                  )}

                  {/* Occupation */}
                  {favorite.profile.occupation && (
                    <p className="text-sm text-gray-500 mb-4">
                      <strong>Occupation:</strong> {favorite.profile.occupation}
                    </p>
                  )}

                  {/* Added Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>Added {formatDate(favorite.createdAt)}</span>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-semibold text-green-600 mb-4">
                    ${favorite.profile.price}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewProfile(favorite.profile.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => {
                        // Add to cart functionality would go here
                        toast({
                          title: "Feature coming soon",
                          description: "Cart functionality will be available soon.",
                        });
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}