import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';
import { useTranslation } from '@/hooks/useTranslation';
import { addLanguageToPath } from '@/lib/i18n';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

const CheckoutForm = () => {
  const { toast } = useToast();
  const { items, clearCart, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { t, currentLanguage } = useTranslation();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!customerEmail) {
      toast({
        title: t.emailRequired,
        description: t.enterEmailAddress,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    try {
      console.log('💳 Creating hosted checkout session...');
      
      const response = await apiRequest("/api/create-checkout-session", {
        method: "POST",
        body: {
          amount: getTotal(),
          profileIds: items.map(item => item.id),
          customerEmail,
          customerName: customerName || "Guest Customer",
          profileNames: items.map(item => item.name),
          language: currentLanguage,
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('✅ Checkout session created, redirecting to Stripe...');
      
      // Redirect to Stripe's hosted checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t.checkoutFailed,
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">{t.emailAddress} *</Label>
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
          <Label htmlFor="name">{t.fullNameOptional}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t.fullName}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{t.orderSummary}</h3>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold">
              <div className="flex justify-between">
                <span>{t.total}:</span>
                <span>${getTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.secureCheckout}</h3>
                <p className="text-sm text-gray-600">{t.poweredByStripe}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{t.sslEncrypted}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{t.pciCompliant}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{t.liveProcessing}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{t.allCardsAccepted}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">{t.livePaymentProcessing}</p>
              <p className="text-xs text-blue-600">{t.redirectToStripe}</p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isProcessing} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t.redirectingToStripe}
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {t.continueToSecureCheckout} - ${getTotal()}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const { items, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { t, currentLanguage } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.emptyCart}</h2>
          <Button onClick={() => setLocation(addLanguageToPath('/browse', currentLanguage))}>
            {t.browse}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t.checkoutTitle}</h1>
            <p className="text-gray-600 mt-1">{t.checkoutSubtitle}</p>
          </div>
          
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}