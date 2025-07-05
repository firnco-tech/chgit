/**
 * ADMIN PANEL COMPONENT - Isolated from main site
 * 
 * AdminDashboard.tsx - Main dashboard for admin panel
 * This component provides overview statistics and profile management
 * Completely separate from user-facing site functionality
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Users, FileText, DollarSign, Edit, Calendar } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeProfiles: number;
  pendingProfiles: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  photos: string[];
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

// Helper function to determine profile status
function getProfileStatus(profile: Profile): 'PENDING' | 'ACTIVE' | 'INACTIVE' {
  if (!profile.isApproved) return 'PENDING';
  if (profile.isApproved && profile.isFeatured) return 'ACTIVE';
  return 'INACTIVE';
}

// Helper function to get status badge styles
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

export default function AdminDashboard() {
  // Fetch dashboard statistics
  const { data: stats = {} as DashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard-stats"],
  });

  // Fetch recent profiles
  const { data: recentProfiles = [] as Profile[], isLoading: profilesLoading } = useQuery<Profile[]>({
    queryKey: ["/api/admin/recent-profiles"],
  });

  // Handle edit profile action
  const handleEditProfile = (profileId: number) => {
    // Navigate to admin edit page (we'll implement this route)
    window.location.href = `/admin/edit-profile/${profileId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of platform activity and key metrics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Platform registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProfiles || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingProfiles || 0} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedOrders || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">Platform earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* PROFILES Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PROFILES
              </CardTitle>
              <CardDescription>Manage and review all platform profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {profilesLoading ? (
                <p className="text-sm text-gray-500">Loading profiles...</p>
              ) : recentProfiles.length === 0 ? (
                <p className="text-sm text-gray-500">No profiles found</p>
              ) : (
                <div className="space-y-4">
                  {recentProfiles.map((profile) => {
                    const status = getProfileStatus(profile);
                    const primaryPhoto = profile.photos && profile.photos.length > 0 ? profile.photos[0] : null;
                    
                    return (
                      <div key={profile.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-4">
                          {/* Profile Picture */}
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {primaryPhoto ? (
                              <img 
                                src={primaryPhoto} 
                                alt={`${profile.firstName} ${profile.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                <span className="text-lg font-medium text-pink-600">
                                  {profile.firstName?.[0] || 'U'}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Profile Info - Clickable Name */}
                          <div>
                            <button 
                              className="text-left hover:text-blue-600 transition-colors"
                              onClick={() => window.open(`/profile/${profile.id}`, '_blank')}
                            >
                              <p className="text-base font-medium text-gray-900 hover:text-blue-600">
                                {profile.firstName} {profile.lastName}
                              </p>
                            </button>
                            <p className="text-sm text-gray-500">
                              {profile.age} • {profile.location}
                            </p>
                            <p className="text-xs text-gray-400">
                              Added {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status and Actions */}
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                            {status}
                          </span>
                          <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                            onClick={() => handleEditProfile(profile.id)}
                          >
                            <Edit className="h-3 w-3" />
                            EDIT
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText className="h-4 w-4" />
                  <span>Review Profiles</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>View Reports</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}