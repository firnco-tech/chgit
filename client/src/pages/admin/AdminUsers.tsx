/**
 * ADMIN USERS PAGE - Manage front-end site users (NOT admin users)
 * 
 * This page allows admins to view and manage regular site users
 * Completely separate from admin user management
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminFooterLogout } from "@/components/admin/AdminFooterLogout";
import { Users, Calendar, Mail, User, Shield, Ban, Eye, X, Heart, ShoppingCart, DollarSign } from "lucide-react";
import { User as UserType } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Link } from "wouter";

interface AdminUserView {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  registrationDate: string;
  lastLogin?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  
  // Fetch users from the backend
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false,
  });

  // Fetch user favorites when a user is selected
  const { data: userFavorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/admin/user-favorites', selectedUser?.id],
    enabled: !!selectedUser?.id,
    retry: false,
  });

  // Fetch user orders when a user is selected
  const { data: userOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/admin/user-orders', selectedUser?.id],
    enabled: !!selectedUser?.id,
    retry: false,
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getUserDisplayName = (user: AdminUserView) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const handleViewDetails = (user: AdminUserView) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage front-end site users, their accounts, and permissions
            </p>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Registered Users
              </CardTitle>
              <CardDescription>
                View and manage all registered site users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading users...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading users. Please try again.</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user: AdminUserView) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* User Avatar */}
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          
                          {/* User Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {getUserDisplayName(user)}
                              </h3>
                              <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {user.isEmailVerified && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                @{user.username}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {formatDate(user.registrationDate)}
                              </span>
                              <span>
                                Last login: {formatDate(user.lastLogin)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/users/${user.id}/details`}>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          <Button 
                            variant={user.isActive ? "destructive" : "default"} 
                            size="sm"
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <User className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Details - {selectedUser && getUserDisplayName(selectedUser)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">User Info</TabsTrigger>
                <TabsTrigger value="favorites">Favorites ({userFavorites.length})</TabsTrigger>
                <TabsTrigger value="orders">Orders ({userOrders.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">@{selectedUser.username}</span>
                    </div>
                  </div>
                </div>
                
                {/* Name Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <span className="text-sm">{selectedUser.firstName || 'Not provided'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <span className="text-sm">{selectedUser.lastName || 'Not provided'}</span>
                  </div>
                </div>
                
                {/* Status Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Account Status</label>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedUser.isActive ? "default" : "destructive"}>
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Status</label>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedUser.isEmailVerified ? "outline" : "secondary"}>
                        {selectedUser.isEmailVerified ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          'Unverified'
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Date Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Registration Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDate(selectedUser.registrationDate)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Login</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDate(selectedUser.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                
                {/* User ID and Role */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <span className="text-sm font-mono">{selectedUser.id}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Badge variant="outline">{selectedUser.role}</Badge>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="favorites" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-semibold">User Favorites</h3>
                </div>
                
                {favoritesLoading ? (
                  <p className="text-sm text-gray-500">Loading favorites...</p>
                ) : userFavorites.length === 0 ? (
                  <p className="text-sm text-gray-500">No favorites found</p>
                ) : (
                  <div className="space-y-3">
                    {userFavorites.map((favorite: any) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            {favorite.profile.photos && favorite.profile.photos.length > 0 ? (
                              <img 
                                src={favorite.profile.photos[0]} 
                                alt={`${favorite.profile.firstName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                <span className="text-lg font-medium text-pink-600">
                                  {favorite.profile.firstName?.[0] || 'P'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {favorite.profile.firstName} {favorite.profile.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {favorite.profile.age} • {favorite.profile.location}
                            </p>
                            <p className="text-xs text-gray-400">
                              Added to favorites {formatDate(favorite.createdAt)}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/profile/${favorite.profile.id}`, '_blank')}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Purchase History</h3>
                </div>
                
                {ordersLoading ? (
                  <p className="text-sm text-gray-500">Loading orders...</p>
                ) : userOrders.length === 0 ? (
                  <p className="text-sm text-gray-500">No orders found</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map((order: any) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.createdAt)} • {order.status}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                            <Badge 
                              variant={order.status === 'completed' ? 'default' : 
                                      order.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {order.items && order.items.length > 0 && (
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Purchased Profiles:</p>
                            <div className="space-y-2">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span>{item.profile?.firstName} {item.profile?.lastName}</span>
                                  <span className="text-gray-500">{formatCurrency(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
                <Button 
                  variant={selectedUser.isActive ? "destructive" : "default"}
                  size="sm"
                >
                  {selectedUser.isActive ? (
                    <>
                      <Ban className="h-4 w-4 mr-1" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-1" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      <AdminFooterLogout />
    </div>
  );
}