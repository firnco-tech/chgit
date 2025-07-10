/**
 * ADMIN PROFILES PAGE - Complete profile management with pagination
 * 
 * This page allows admins to view and manage all profiles with:
 * - Pagination support
 * - Status filtering (pending, approved, all)
 * - Search functionality
 * - Bulk actions
 */

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooterLogout } from "@/components/admin/AdminFooterLogout";
import { 
  FileText, 
  Edit, 
  Eye, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Calendar,
  CheckCircle,
  Clock,
  X
} from "lucide-react";
import { Profile } from "@shared/schema";

function getProfileStatus(profile: Profile): 'PENDING' | 'ACTIVE' | 'INACTIVE' {
  if (!profile.isApproved) return 'PENDING';
  return profile.isApproved ? 'ACTIVE' : 'INACTIVE';
}

function getStatusBadgeClass(status: 'PENDING' | 'ACTIVE' | 'INACTIVE'): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function AdminProfiles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage] = useState(20);

  // Calculate pagination
  const offset = (currentPage - 1) * itemsPerPage;

  // Build query parameters
  const queryParams = new URLSearchParams({
    limit: itemsPerPage.toString(),
    offset: offset.toString(),
  });

  if (statusFilter !== 'all') {
    queryParams.set('status', statusFilter);
  }

  // Fetch profiles with pagination
  const { data: profiles = [], isLoading, error } = useQuery<Profile[]>({
    queryKey: ['/api/admin/profiles', statusFilter, currentPage, itemsPerPage],
    queryFn: async () => {
      const response = await fetch(`/api/admin/profiles?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return response.json();
    },
    retry: false,
  });

  // Filter profiles by search query on frontend
  const filteredProfiles = profiles.filter(profile => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.firstName.toLowerCase().includes(searchLower) ||
      profile.lastName.toLowerCase().includes(searchLower) ||
      profile.location.toLowerCase().includes(searchLower) ||
      profile.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditProfile = (profileId: number) => {
    window.location.href = `/admin/edit-profile/${profileId}`;
  };

  const handleViewProfile = (profileId: number) => {
    window.open(`/profile/${profileId}`, '_blank');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  const showPagination = profiles.length > 0 && totalPages > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8" />
              Profile Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all platform profiles with advanced filtering and pagination
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
              <CardDescription>
                Filter profiles by status and search by name, location, or email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search profiles by name, location, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Profiles</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profiles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Profiles ({filteredProfiles.length})
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Page {currentPage} of {totalPages || 1}</span>
                </div>
              </CardTitle>
              <CardDescription>
                Complete list of all profiles with management actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading profiles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <X className="h-8 w-8 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500">Error loading profiles. Please try again.</p>
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchQuery ? 'No profiles found matching your search.' : 'No profiles found.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map((profile) => {
                    const status = getProfileStatus(profile);
                    const primaryPhoto = profile.primaryPhoto || (profile.photos && profile.photos.length > 0 ? profile.photos[0] : null);
                    
                    return (
                      <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Profile Picture */}
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {primaryPhoto ? (
                                <img 
                                  src={primaryPhoto.startsWith('http') ? primaryPhoto : `/uploads/images/${primaryPhoto}`}
                                  alt={`${profile.firstName} ${profile.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                  <span className="text-xl font-medium text-pink-600">
                                    {profile.firstName?.[0] || 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Profile Info */}
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {profile.firstName} {profile.lastName}
                                </h3>
                                <Badge className={getStatusBadgeClass(status)}>
                                  {status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span>{profile.age} years old</span>
                                <span>•</span>
                                <span>{profile.location}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(profile.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {profile.email && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {profile.email}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(profile.id)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleEditProfile(profile.id)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {showPagination && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProfiles.length)} of {filteredProfiles.length} profiles
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AdminFooterLogout />
    </div>
  );
}