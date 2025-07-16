import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Calendar, Mail, User, Eye, Package, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Link, useLocation } from 'wouter';

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  photos: string[];
  price: number;
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

export default function OrderHistory() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Query for user's order history
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/orders/my-orders'],
    enabled: !!user,
  });

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your order history.
          </p>
          <Button onClick={() => setLocation('/login')} className="w-full">
            Login
          </Button>
        </div>
      </div>
    );
  }

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading your order history. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View your complete order history and contact information for purchased profiles.
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatOrderPrice(orders.reduce((sum, order) => sum + parseFloat(order.totalAmount.toString()), 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profiles Purchased</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.reduce((sum, order) => sum + order.items.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't made any purchases yet. Start browsing profiles to connect with Dominican women.
              </p>
              <Link href="/en/browse">
                <Button>
                  Browse Profiles
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <Package className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                      </div>
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
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Customer Information</p>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            {order.customerName || 'Not provided'}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {order.customerEmail}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Order Details</p>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="h-4 w-4 mr-2" />
                            {order.items.length} profile{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-4">Purchased Profiles & Contact Information</p>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                {item.profile.photos && item.profile.photos.length > 0 ? (
                                  <img 
                                    src={item.profile.photos[0]} 
                                    alt={`${item.profile.firstName}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                                    <span className="text-lg font-medium text-pink-600">
                                      {item.profile.firstName?.[0] || 'P'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.profile.firstName} {item.profile.lastName}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.profile.age} years old • {item.profile.location}
                                </p>
                                <p className="text-sm font-medium text-pink-600 mt-1">
                                  {formatOrderPrice(parseFloat(item.price.toString()))}
                                </p>
                              </div>
                              <div className="text-right">
                                <Link href={`/en/${item.profile.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Button>
                                </Link>
                              </div>
                            </div>
                            
                            {/* Contact Information */}
                            {item.contactInfo && (
                              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-800 mb-2">Contact Information:</p>
                                <div className="space-y-1 text-sm text-green-700">
                                  {item.contactInfo.whatsapp && (
                                    <p><span className="font-medium">WhatsApp:</span> {item.contactInfo.whatsapp}</p>
                                  )}
                                  {item.contactInfo.instagram && (
                                    <p><span className="font-medium">Instagram:</span> {item.contactInfo.instagram}</p>
                                  )}
                                  {item.contactInfo.email && (
                                    <p><span className="font-medium">Email:</span> {item.contactInfo.email}</p>
                                  )}
                                  {item.contactInfo.phone && (
                                    <p><span className="font-medium">Phone:</span> {item.contactInfo.phone}</p>
                                  )}
                                  {item.contactInfo.telegram && (
                                    <p><span className="font-medium">Telegram:</span> {item.contactInfo.telegram}</p>
                                  )}
                                  {item.contactInfo.facebook && (
                                    <p><span className="font-medium">Facebook:</span> {item.contactInfo.facebook}</p>
                                  )}
                                  {item.contactInfo.tiktok && (
                                    <p><span className="font-medium">TikTok:</span> {item.contactInfo.tiktok}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
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