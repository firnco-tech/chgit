import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Mail, Calendar, Clock, Heart, ShoppingCart, Eye, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminFooterLogout } from '@/components/admin/AdminFooterLogout';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  photos: string[];
  price: number;
}

interface UserFavorite {
  id: number;
  profileId: number;
  createdAt: string;
  profile: Profile;
}

interface OrderItem {
  id: number;
  profileId: number;
  price: number;
  contactInfo: any;
  profile: Profile;
}

interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminUserDetails() {
  const { userId } = useParams<{ userId: string }>();

  // Query for user details
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/admin/users/${userId}`],
    enabled: !!userId,
  });

  // Query for user favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<UserFavorite[]>({
    queryKey: [`/api/admin/users/${userId}/favorites`],
    enabled: !!userId,
  });

  // Query for user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: [`/api/admin/users/${userId}/orders`],
    enabled: !!userId,
  });

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const formatOrderPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
        <AdminFooterLogout />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600 mb-8">The requested user could not be found.</p>
            <Link href="/admin/users">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>
        </div>
        <AdminFooterLogout />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                <p className="text-gray-600">{getUserDisplayName(user)}</p>
              </div>
            </div>
            <Badge variant={user.isActive ? 'default' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* User Details Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">User Info</TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>
          
          {/* User Information Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.username}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Registration Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Login</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true }) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorited Profiles ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading favorites...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No favorite profiles yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
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
                              {favorite.profile.age} years old • {favorite.profile.location}
                            </p>
                            <p className="text-sm text-gray-400">
                              Added {formatDistanceToNow(new Date(favorite.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-pink-600">
                              {formatOrderPrice(favorite.profile.price)}
                            </p>
                            <Link href={`/admin/profiles/${favorite.profile.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order History ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status.toUpperCase()}
                            </Badge>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {formatOrderPrice(parseFloat(order.totalAmount.toString()))}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-700">Purchased Profiles:</h5>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 pl-4 border-l-2 border-gray-200">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                {item.profile.photos && item.profile.photos.length > 0 ? (
                                  <img 
                                    src={item.profile.photos[0]} 
                                    alt={`${item.profile.firstName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-pink-600">
                                      {item.profile.firstName?.[0] || 'P'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-900">
                                  {item.profile.firstName} {item.profile.lastName}
                                </h6>
                                <p className="text-sm text-gray-500">
                                  {item.profile.age} years old • {item.profile.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatOrderPrice(parseFloat(item.price.toString()))}
                                </p>
                                <Link href={`/admin/profiles/${item.profile.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AdminFooterLogout />
    </div>
  );
}