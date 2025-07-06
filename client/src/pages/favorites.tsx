import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";
import { Loader2, Search, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { Profile, UserFavorite } from "@shared/schema";

// Type for favorite profiles with included profile data
type FavoriteProfile = UserFavorite & { profile: Profile };

export default function Favorites() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Filter and sorting states - same as browse page
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // Fetch user favorites with profile data
  const { data: favorites = [], isLoading } = useQuery<FavoriteProfile[]>({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Extract profiles from favorites for consistent handling
  const favoriteProfiles = favorites.map(fav => fav.profile);

  // Apply filters - same logic as browse page
  const filteredProfiles = favoriteProfiles.filter(profile => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const location = profile.location?.toLowerCase() || '';
      const occupation = profile.occupation?.toLowerCase() || '';
      const aboutMe = profile.aboutMe?.toLowerCase() || '';
      
      if (!fullName.includes(query) && 
          !location.includes(query) && 
          !occupation.includes(query) && 
          !aboutMe.includes(query)) {
        return false;
      }
    }

    // Age filter
    if (ageFilter && ageFilter !== 'all') {
      const [minAge, maxAge] = ageFilter.split('-').map(Number);
      if (profile.age < minAge || (maxAge && profile.age > maxAge)) {
        return false;
      }
    }

    // Location filter
    if (locationFilter && locationFilter !== 'all') {
      if (profile.location !== locationFilter) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting - same logic as browse page
  const sortedProfiles = [...filteredProfiles];
  if (sortBy === "newest") {
    sortedProfiles.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  } else if (sortBy === "age") {
    sortedProfiles.sort((a, b) => a.age - b.age);
  } else if (sortBy === "added") {
    // Sort by when added to favorites
    sortedProfiles.sort((a, b) => {
      const favA = favorites.find(fav => fav.profile.id === a.id);
      const favB = favorites.find(fav => fav.profile.id === b.id);
      return new Date(favB?.createdAt || 0).getTime() - new Date(favA?.createdAt || 0).getTime();
    });
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Component will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - same as browse page */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Favorites</h3>
                
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search favorites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range
                    </label>
                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Ages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-30">26-30</SelectItem>
                        <SelectItem value="31-35">31-35</SelectItem>
                        <SelectItem value="36-99">36+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Santo Domingo">Santo Domingo</SelectItem>
                        <SelectItem value="Santiago">Santiago</SelectItem>
                        <SelectItem value="Puerto Plata">Puerto Plata</SelectItem>
                        <SelectItem value="La Romana">La Romana</SelectItem>
                        <SelectItem value="Punta Cana">Punta Cana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Grid - same structure as browse page */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {sortedProfiles.length} of {favoriteProfiles.length} favorites
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="added">Sort by added date</SelectItem>
                    <SelectItem value="newest">Sort by newest</SelectItem>
                    <SelectItem value="age">Sort by age</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : favoriteProfiles.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">
                  Start browsing profiles and click the heart icon to save your favorites here.
                </p>
                <Button onClick={() => setLocation("/browse")}>
                  Browse Profiles
                </Button>
              </div>
            ) : sortedProfiles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No favorites match your current filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setAgeFilter("all");
                    setLocationFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}