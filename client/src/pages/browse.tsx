import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileCard } from "@/components/profile-card";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Profile } from "@shared/schema";
import SEO, { structuredDataSchemas } from "@/components/SEO";
import { useTranslation } from "@/hooks/useTranslation";

export default function Browse() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Responsive items per page: 20 desktop, 12 mobile
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth >= 1024 ? 20 : 12);
    };
    
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationFilter]);

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles', { search: searchQuery, location: locationFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (locationFilter && locationFilter !== 'all') params.append('location', locationFilter);
      
      const response = await fetch(`/api/profiles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch profiles');
      return response.json();
    },
  });

  const filteredProfiles = profiles ? [...profiles] : [];
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        page="browse" 
        structuredData={structuredDataSchemas.website}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.browsePageTitle}</h2>
        
        {/* Desktop Horizontal Filters */}
        <div className="hidden lg:block mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                

                
                {/* Location */}
                <div className="min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.location}
                  </label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.allLocations} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allLocations}</SelectItem>
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

        {/* Mobile Filters (Original Sidebar Style) */}
        <div className="lg:hidden mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.filters}</h3>
              
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search profiles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">
            {filteredProfiles.length} profiles found
          </span>
          {totalPages > 1 && (
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
        
        {/* Profile Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No profiles found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      size="sm"
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
