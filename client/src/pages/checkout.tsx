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

  // Debug logging
  useEffect(() => {
    console.log('🔍 CheckoutForm Debug:', {
      stripe: !!stripe,
      elements: !!elements,
      stripeReady: stripe !== null,
      elementsReady: elements !== null
    });
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
                {!stripe ? (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Loading payment form...</p>
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

            <Button 
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Payment Error</h2>
            <p className="text-red-600 mb-4">
              {stripeError || 'Failed to initialize payment system.'}
            </p>
            <p className="text-sm text-red-500 mb-4">
              This may be due to ad blockers blocking Stripe. Please disable ad blockers and try again.
            </p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()}>
                Retry Payment
              </Button>
              <Button variant="outline" onClick={() => setLocation(addLanguageToPath('/browse', currentLanguage))}>
                Back to Browse
              </Button>
            </div>
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
        
        {/* Live Mode Notice */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
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
      </div>
    </div>
  );
}
