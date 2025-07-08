/**
 * PAYMENT SUCCESS PAGE - Digital Order Delivery
 * 
 * Handles successful payment confirmation and displays purchased contact information
 * This page is reached after Stripe payment completion via redirect
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Eye, Phone, Mail, MessageCircle, Camera, Video } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { Navbar } from "@/components/navbar";
import { useCart } from "@/lib/cart";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  photos: string[];
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
  totalAmount: string;
  status: string;
  createdAt: string;
}

interface PaymentSuccessData {
  success: boolean;
  order: Order;
  contactInfo: OrderItem[];
}

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [orderData, setOrderData] = useState<PaymentSuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const sessionId = urlParams.get('session_id');
    
    if (!paymentIntentId && !sessionId) {
      setError('Payment information not found');
      setLoading(false);
      return;
    }

    // Process the successful payment and get order details
    const requestBody = sessionId ? { sessionId } : { paymentIntentId };
    
    apiRequest('/api/payment-success', {
      method: 'POST',
      body: requestBody
    })
      .then(response => response.json())
      .then((data: PaymentSuccessData) => {
        if (data.success) {
          setOrderData(data);
          // Clear the cart after successful payment processing
          clearCart();
          console.log('✅ Cart cleared after successful payment');
        } else {
          setError('Failed to process order');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error processing payment:', err);
        setError('Error processing your order');
        setLoading(false);
      });
  }, []);

  const formatContactMethod = (method: string, value: string) => {
    const contactIcons: { [key: string]: any } = {
      whatsapp: Phone,
      instagram: Camera,
      email: Mail,
      telegram: MessageCircle,
      facebook: Video,
      tiktok: Video
    };

    const Icon = contactIcons[method] || MessageCircle;
    
    return (
      <div key={method} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
        <Icon className="h-4 w-4 text-primary" />
        <span className="capitalize font-medium">{method}:</span>
        <span className="text-gray-700">{value}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing your order...</h2>
            <p className="text-gray-600">Please wait while we prepare your contact information.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/browse')}>
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Order not found</h2>
            <Button onClick={() => navigate('/browse')}>
              Back to Browse
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your contact information is now available below.
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Order ID:</strong> #{orderData.order.id}</p>
                <p><strong>Customer:</strong> {orderData.order.customerName || orderData.order.customerEmail}</p>
                <p><strong>Email:</strong> {orderData.order.customerEmail}</p>
              </div>
              <div>
                <p><strong>Total Amount:</strong> ${orderData.order.totalAmount}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{orderData.order.status}</span></p>
                <p><strong>Date:</strong> {new Date(orderData.order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information for Each Profile */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Purchased Contact Information</h2>
          
          {orderData.contactInfo.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    {item.profile.photos && item.profile.photos.length > 0 && (
                      <img 
                        src={item.profile.photos[0]} 
                        alt={`${item.profile.firstName} ${item.profile.lastName}`}
                        className="w-16 h-16 object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/120/120?random=${item.profile.id}`;
                        }}
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">
                        {item.profile.firstName} {item.profile.lastName}
                      </h3>
                      <p className="text-gray-600">
                        {item.profile.age} years old • {item.profile.location}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/profile/${item.profile.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Information (Purchased for ${item.price})
                  </h4>
                  
                  {item.contactInfo && Object.keys(item.contactInfo).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(item.contactInfo).map(([method, value]) => 
                        value ? formatContactMethod(method, value as string) : null
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">
                      Contact information will be updated shortly. Please check your email for updates.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <Button onClick={() => navigate('/browse')} variant="outline">
            Browse More Profiles
          </Button>
          <Button onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Print Order Details
          </Button>
        </div>

        {/* Order Confirmation Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📧 Order Confirmation Email</h4>
          <p className="text-blue-700">
            A detailed order confirmation with all contact information has been sent to <strong>{orderData.order.customerEmail}</strong>. 
            Please check your inbox (and spam folder) for the email with subject "Your HolaCupid Order Confirmation - Order #{orderData.order.id}".
          </p>
        </div>
      </div>
    </div>
  );
}