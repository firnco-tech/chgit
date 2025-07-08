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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

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
      // Standard Stripe Elements flow - no custom logic
      if (!stripe || !elements) {
        throw new Error('Stripe not initialized');
      }

      console.log('💳 Processing with Stripe Elements');
      
      // Update payment intent with customer details
      await apiRequest("/api/update-payment-intent", {
        method: "POST",
        body: {
          customerEmail,
          customerName: customerName || "Guest Customer",
          profileIds: items.map(item => item.id),
        }
      });

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${addLanguageToPath('/payment-success', currentLanguage)}`,
        },
      });

      if (error) {
        console.error('Payment failed:', error);
        toast({
          title: "Payment failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful');
        clearCart();
        setLocation(addLanguageToPath('/payment-success', currentLanguage));
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Full Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="border-t pt-4">
          <Label>Payment Information</Label>
          <div className="mt-2">
            {!stripe ? (
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
              />
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Live Payment Processing</p>
              <p className="text-xs text-blue-600">Your payment will be processed securely by Stripe</p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isProcessing || !stripe} 
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            `Complete Payment - $${getTotal()}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const { items, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { currentLanguage } = useTranslation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setLocation(addLanguageToPath('/cart', currentLanguage));
      return;
    }

    const initializePayment = async () => {
      console.log('💳 Initializing payment for amount:', getTotal());
      setPaymentLoading(true);
      
      try {
        const response = await apiRequest("/api/create-payment-intent", {
          method: "POST",
          body: {
            amount: getTotal(),
            profileIds: items.map(item => item.id),
            customerEmail: "placeholder@email.com",
          }
        });
        
        const data = await response.json();
        console.log('✅ Payment intent created');
        setClientSecret(data.clientSecret);
        setPaymentLoading(false);
        
      } catch (error) {
        console.error('Payment initialization failed:', error);
        setPaymentLoading(false);
      }
    };

    initializePayment();
  }, [items, getTotal, setLocation, currentLanguage]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => setLocation(addLanguageToPath('/browse', currentLanguage))}>
            Browse Profiles
          </Button>
        </div>
      </div>
    );
  }

  if (paymentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Preparing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Payment Initialization Failed</h2>
            <p className="text-red-600 mb-4">Unable to initialize secure payment processing.</p>
            <Button onClick={() => setLocation(addLanguageToPath('/cart', currentLanguage))}>
              Back to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.photo || `https://picsum.photos/60/60?random=${item.id}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Age: {item.age}</p>
                    </div>
                    <p className="font-medium">${item.price}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-primary">${getTotal()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}