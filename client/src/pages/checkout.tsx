import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/lib/cart';
import { useTranslation } from '@/hooks/useTranslation';
import { addLanguageToPath } from '@/lib/i18n';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, User, Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import SmartPayPalButton from '@/components/SmartPayPalButton';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

const CheckoutForm = () => {
  const { toast } = useToast();
  const { items, clearCart, getTotal } = useCart();
  const [, setLocation] = useLocation();
  const { t, currentLanguage } = useTranslation();
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Authentication
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Pre-populate email if user is authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      setCustomerEmail(user.email);
      if (user.username) {
        setCustomerName(user.username);
      }
    }
  }, [user, isAuthenticated]);

  const handleAuthSuccess = () => {
    // After successful authentication, the useEffect will populate the email
    toast({
      title: "Account Ready!",
      description: "You can now complete your purchase securely.",
    });
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">{t.emailAddress} *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            readOnly={isAuthenticated}
            className={isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""}
            required
          />
          {isAuthenticated && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Verified account email
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="name">{t.fullNameOptional}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t.fullName}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            readOnly={isAuthenticated}
            className={isAuthenticated ? "bg-gray-50 cursor-not-allowed" : ""}
          />
          {isAuthenticated && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              From your account profile
            </p>
          )}
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
                <p className="text-sm text-gray-600">Powered by PayPal</p>
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
                <span className="text-gray-700">All Cards Accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced PayPal Checkout - Requires Authentication */}
        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-base font-medium text-gray-900">Secure Payment</Label>
            <p className="text-sm text-gray-600 mt-1">PayPal, Credit/Debit Card, Apple Pay, Google Pay</p>
          </div>
          
          {authLoading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading...</p>
            </div>
          ) : isAuthenticated && customerEmail ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Account Verified - ${getTotal()}</p>
                    <p className="text-xs text-green-600">Your purchase will be linked to your account for easy access</p>
                  </div>
                </div>
              </div>
              <SmartPayPalButton 
                amount={getTotal().toString()}
                currency="USD"
                customerEmail={customerEmail}
                customerName={customerName}
                onSuccess={(details) => {
                  console.log('Payment completed successfully:', details);
                  toast({
                    title: 'Payment Successful!',
                    description: 'Thank you for your purchase. You will receive an email confirmation shortly.',
                    variant: 'default',
                  });
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  toast({
                    title: 'Payment Failed',
                    description: 'There was an issue processing your payment. Please try again.',
                    variant: 'destructive',
                  });
                }}
                onCancel={() => {
                  toast({
                    title: 'Payment Cancelled',
                    description: 'Your payment was cancelled. You can try again when ready.',
                    variant: 'default',
                  });
                }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <User className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Account Required for Purchase</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Create a secure account to complete your purchase and access your order history.
                </p>
                <div className="space-y-2 text-xs text-yellow-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-3 w-3" />
                    <span>Secure purchase verification</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-3 w-3" />
                    <span>Access your order history anytime</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                Create Account to Complete Purchase - ${getTotal()}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Already have an account? The login option will appear in the next step.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthSuccess}
        trigger="checkout"
      />
    </div>
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