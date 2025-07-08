import { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { stripePromise } from "@/lib/stripe";
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTranslation } from "@/hooks/useTranslation";
import { addLanguageToPath } from "@/lib/i18n";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, clearCart, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { currentLanguage } = useTranslation();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentElementError, setPaymentElementError] = useState(false);

  // Debug logging and error detection
  useEffect(() => {
    console.log('🔍 CheckoutForm Debug:', {
      stripe: !!stripe,
      elements: !!elements,
      stripeReady: stripe !== null,
      elementsReady: elements !== null
    });

    // Check for Stripe loading errors after a delay
    const timer = setTimeout(() => {
      if (!stripe || !elements) {
        setPaymentElementError(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    if (!customerEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    try {
      // Update customer details before confirming payment
      await apiRequest("/api/update-payment-intent", {
        method: "POST",
        body: {
          customerEmail,
          customerName: customerName || "Guest Customer",
          profileIds: items.map(item => item.id),
        }
      });

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${addLanguageToPath('/payment-success', currentLanguage)}?email=${encodeURIComponent(customerEmail)}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        clearCart();
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase! You will receive your contact information shortly.",
        });
      }
    } catch (updateError) {
      console.error('Error updating payment details:', updateError);
      toast({
        title: "Error",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <Label>Payment Information</Label>
              <div className="mt-2">
                {paymentElementError ? (
                  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-800">Ad Blocker Detected</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>The payment form cannot load due to ad blocker interference. Please:</p>
                          <ul className="mt-2 list-disc list-inside space-y-1">
                            <li>Disable your ad blocker for this site</li>
                            <li>Allow third-party cookies for secure payment processing</li>
                            <li>Refresh the page after making changes</li>
                          </ul>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => window.location.reload()}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            Refresh Page
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setPaymentElementError(false)}
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : !stripe ? (
                  <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-sm text-gray-600">Loading secure payment form...</p>
                  </div>
                ) : (
                  <PaymentElement 
                    options={{
                      layout: 'tabs',
                      fields: {
                        billingDetails: 'auto'
                      }
                    }}
                    onReady={() => {
                      console.log('✅ PaymentElement loaded successfully');
                      setPaymentElementError(false);
                    }}
                    onLoadError={(error) => {
                      console.error('❌ PaymentElement failed to load:', error);
                      setPaymentElementError(true);
                    }}
                  />
                )}
              </div>
            </div>

            <Button 
              type="submit"
              disabled={!stripe || isProcessing || paymentElementError}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : paymentElementError ? (
                "Fix Payment Form Issues Above"
              ) : (
                `Pay $${getTotal().toFixed(2)}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const { items, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { currentLanguage } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      setLocation(addLanguageToPath('/browse', currentLanguage));
      return;
    }

    // Create PaymentIntent as soon as the page loads
    console.log('💳 Creating payment intent for amount:', getTotal());
    setPaymentLoading(true);
    
    apiRequest("/api/create-payment-intent", {
      method: "POST",
      body: {
        amount: getTotal(),
        profileIds: items.map(item => item.id),
        customerEmail: "placeholder@email.com", // Will be updated when form is submitted
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Payment intent created:', data.clientSecret.substring(0, 20) + '...');
        setClientSecret(data.clientSecret);
        setPaymentLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error creating payment intent:', error);
        setStripeError('Failed to initialize payment. Please try again.');
        setPaymentLoading(false);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please refresh and try again.",
          variant: "destructive",
        });
      });
  }, [items, getTotal, setLocation, toast, currentLanguage]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some profiles to your cart before checkout</p>
          <Button onClick={() => setLocation(addLanguageToPath('/browse', currentLanguage))}>
            Browse Profiles
          </Button>
        </div>
      </div>
    );
  }

  if (paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (stripeError || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="text-center mb-6">
              <svg className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Payment System Blocked</h2>
              <p className="text-red-600 mb-4">
                {stripeError || 'Unable to initialize secure payment processing.'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Quick Fix Instructions:</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600">1.</span>
                  <span>Disable ad blockers (uBlock Origin, AdBlock Plus, Ghostery)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600">2.</span>
                  <span>Allow third-party cookies for secure payment processing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-red-600">3.</span>
                  <span>Refresh this page after making changes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Refresh & Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation(addLanguageToPath('/browse', currentLanguage))}
              >
                Back to Browse
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Need help? Contact support with error: "Payment initialization failed"
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img 
                        src={item.photo} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                      <span className="font-semibold">${item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#e91e63',
                    colorBackground: '#ffffff',
                    colorText: '#000000',
                    colorDanger: '#df1b41',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    spacingUnit: '2px',
                    borderRadius: '4px',
                  }
                }
              }}
            >
              <CheckoutForm />
            </Elements>
          </div>
        </div>
        
        {/* Live Mode Notice & Troubleshooting */}
        <div className="mt-8 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Secure Payment Processing</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>All payments are processed securely through Stripe. Your card information is never stored on our servers.</p>
                  <p className="mt-1 text-xs">We accept all major credit and debit cards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Payment Form Not Loading?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">If the payment form doesn't appear, try these steps:</p>
                  <div className="space-y-2">
                    <details className="cursor-pointer">
                      <summary className="font-medium">Chrome/Edge Users</summary>
                      <ul className="mt-1 ml-4 list-disc text-xs">
                        <li>Click the shield icon in the address bar</li>
                        <li>Select "Allow all cookies" or "Allow third-party cookies"</li>
                        <li>Disable any ad blockers (uBlock Origin, AdBlock Plus)</li>
                      </ul>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-medium">Firefox Users</summary>
                      <ul className="mt-1 ml-4 list-disc text-xs">
                        <li>Click the shield icon next to the address bar</li>
                        <li>Turn off Enhanced Tracking Protection for this site</li>
                        <li>Disable any ad blocking extensions</li>
                      </ul>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-medium">Safari Users</summary>
                      <ul className="mt-1 ml-4 list-disc text-xs">
                        <li>Go to Safari → Preferences → Privacy</li>
                        <li>Uncheck "Prevent cross-site tracking"</li>
                        <li>Refresh the page</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
