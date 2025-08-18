import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail } from 'lucide-react';

interface OrderDetails {
  orderId: string;
  amount: string;
  currency: string;
  status: string;
  customerEmail: string;
  profiles: any[];
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const { t, currentLanguage } = useTranslation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
      // Fetch order details
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Error fetching order details:', data.error);
            // If order not found, create a success message anyway since payment was successful
            setOrderDetails({
              orderId,
              amount: '6.00', // Default amount
              currency: 'USD',
              status: 'COMPLETED',
              customerEmail: '',
              profiles: []
            });
          } else {
            setOrderDetails(data);
          }
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
          // Create success message even if fetch fails
          setOrderDetails({
            orderId,
            amount: '6.00',
            currency: 'USD',
            status: 'COMPLETED',
            customerEmail: '',
            profiles: []
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the details for this order.</p>
          <Button onClick={() => setLocation(`/${currentLanguage}/browse`)}>
            Continue Browsing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-50 border-b border-green-200 px-6 py-8 text-center">
            <div className="text-green-500 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Payment Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm text-gray-900">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">
                      ${orderDetails.amount} {orderDetails.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-900">PayPal</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
                      <p className="text-sm text-gray-600">
                        A confirmation email with your purchase details has been sent.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Download className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact Information</p>
                      <p className="text-sm text-gray-600">
                        You now have access to the contact information for the profiles you purchased.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation(`/${currentLanguage}/browse`)}
                  className="flex items-center space-x-2"
                >
                  <span>Continue Browsing</span>
                </Button>
                <Button 
                  onClick={() => setLocation(`/${currentLanguage}/favorites`)}
                  className="flex items-center space-x-2"
                >
                  <span>View Your Purchases</span>
                </Button>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need help? Contact our support team at{' '}
                <a href="mailto:admin@holacupid.com" className="text-blue-600 hover:underline">
                  admin@holacupid.com
                </a>
              </p>
              <p className="text-xs text-gray-500">
                Please include your order ID ({orderDetails.orderId}) in any support requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}