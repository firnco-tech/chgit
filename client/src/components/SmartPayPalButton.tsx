import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/cart';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface SmartPayPalButtonProps {
  amount: string;
  currency?: string;
  customerEmail: string;
  customerName?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export default function SmartPayPalButton({
  amount,
  currency = 'USD',
  customerEmail,
  customerName,
  onSuccess,
  onError,
  onCancel,
}: SmartPayPalButtonProps) {
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { currentLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonsRendered = useRef(false);
  const retryAttempts = useRef(0);
  const maxRetries = 5;

  // Define renderPayPalButtons at component level so it's accessible everywhere
  const renderPayPalButtons = () => {
    if (!window.paypal) {
      console.log('❌ PayPal SDK not available');
      return;
    }
    
    if (!paypalRef.current) {
      if (retryAttempts.current < maxRetries) {
        retryAttempts.current++;
        console.log(`❌ PayPal container ref not available, retrying... (${retryAttempts.current}/${maxRetries})`);
        setTimeout(() => {
          renderPayPalButtons();
        }, 200);
        return;
      } else {
        console.error('❌ PayPal container ref not available after max retries');
        setSdkError('Failed to initialize PayPal buttons');
        setIsLoading(false);
        return;
      }
    }
    
    if (buttonsRendered.current) {
      console.log('ℹ️ PayPal buttons already rendered');
      return;
    }

    try {
      console.log('🔄 Starting PayPal button render...');
      
      // Clear any existing buttons
      paypalRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45,
          tagline: false
        },
        
        createOrder: async () => {
          try {
            console.log('Creating PayPal order...');
            
            const orderResponse = await fetch('/api/paypal/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount,
                currency,
                customerEmail,
                customerName,
              }),
            });

            const orderData = await orderResponse.json();
            
            if (orderData.error) {
              throw new Error(orderData.error);
            }

            console.log('PayPal order created:', orderData.id);
            return orderData.id;
          } catch (error) {
            console.error('Error creating PayPal order:', error);
            setSdkError('Failed to create payment order');
            throw error;
          }
        },

        onApprove: async (data: any) => {
          try {
            console.log('PayPal payment approved, capturing order:', data.orderID);
            
            const captureResponse = await fetch(`/api/paypal/orders/${data.orderID}/capture`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const captureData = await captureResponse.json();
            
            if (captureData.error) {
              throw new Error(captureData.error);
            }

            console.log('PayPal order captured successfully:', captureData);
            
            toast({
              title: 'Payment Successful!',
              description: 'Your payment has been processed successfully.',
              variant: 'default',
            });

            // Clear cart and redirect
            clearCart();
            setLocation(`/${currentLanguage}/order-confirmation?orderId=${captureData.orderId}`);
            
            if (onSuccess) {
              onSuccess(captureData);
            }
          } catch (error) {
            console.error('Error capturing PayPal order:', error);
            toast({
              title: 'Payment Processing Error',
              description: 'There was an error processing your payment. Please try again.',
              variant: 'destructive',
            });
            
            if (onError) {
              onError(error);
            }
          }
        },

        onCancel: () => {
          console.log('PayPal payment cancelled by user');
          toast({
            title: 'Payment Cancelled',
            description: 'Your payment was cancelled.',
            variant: 'default',
          });
          
          if (onCancel) {
            onCancel();
          }
        },

        onError: (err: any) => {
          console.error('PayPal button error:', err);
          toast({
            title: 'Payment Error',
            description: 'An error occurred with the payment system. Please try again.',
            variant: 'destructive',
          });
          
          if (onError) {
            onError(err);
          }
        }
      }).render(paypalRef.current).then(() => {
        buttonsRendered.current = true;
        setIsLoading(false);
        console.log('✅ PayPal Smart Payment Buttons rendered successfully');
      }).catch((renderError: any) => {
        console.error('❌ PayPal button render failed:', renderError);
        setSdkError('Failed to render PayPal buttons');
        setIsLoading(false);
      });
    } catch (error) {
      console.error('❌ Error in PayPal button setup:', error);
      setSdkError('Failed to render PayPal buttons');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!customerEmail || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const loadPayPalSDK = async () => {
      try {
        setIsLoading(true);
        setSdkError(null);

        // Get PayPal configuration from backend
        const response = await fetch('/api/paypal/setup');
        const config = await response.json();
        
        if (config.error) {
          throw new Error(config.error);
        }

        // Load PayPal SDK if not already loaded
        if (!window.paypal) {
          const script = document.createElement('script');
          script.src = `https://www.paypal.com/sdk/js?client-id=${config.clientId}&currency=${currency}&intent=capture&components=buttons,marks`;
          script.async = true;
          
          script.onload = () => {
            console.log('✅ PayPal SDK loaded successfully');
          };
          
          script.onerror = () => {
            setSdkError('Failed to load PayPal SDK');
            setIsLoading(false);
          };
          
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('PayPal SDK configuration error:', error);
        setSdkError(error instanceof Error ? error.message : 'PayPal configuration failed');
        setIsLoading(false);
      }
    };

    if (customerEmail && amount && parseFloat(amount) > 0) {
      loadPayPalSDK();
    }
  }, [amount, currency, customerEmail, customerName]);

  // Watch for when PayPal SDK becomes available and render buttons
  useEffect(() => {
    const checkAndRender = () => {
      console.log('🔍 Checking render conditions:', {
        hasPayPal: !!window.paypal,
        hasRef: !!paypalRef.current,
        notRendered: !buttonsRendered.current,
        hasEmail: !!customerEmail,
        hasAmount: !!amount && parseFloat(amount) > 0
      });
      
      if (window.paypal && paypalRef.current && !buttonsRendered.current && customerEmail && amount && parseFloat(amount) > 0) {
        console.log('🔄 All conditions met, rendering PayPal buttons...');
        renderPayPalButtons();
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkAndRender()) return;

    // If not ready, poll until ready or timeout
    const interval = setInterval(() => {
      if (checkAndRender()) {
        clearInterval(interval);
      }
    }, 100);

    // Clear interval after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('⚠️ PayPal button rendering timeout');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [customerEmail, amount, currency, customerName]);

  // Cleanup function
  useEffect(() => {
    return () => {
      buttonsRendered.current = false;
      retryAttempts.current = 0;
    };
  }, []);

  if (!customerEmail) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">Please enter your email address to continue with payment</p>
      </div>
    );
  }

  if (!amount || parseFloat(amount) <= 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-sm text-red-600">Invalid payment amount</p>
      </div>
    );
  }

  if (sdkError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-sm text-red-600">Payment system error: {sdkError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-blue-600 underline text-sm"
        >
          Reload page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">Secure Payment - ${amount}</p>
            <p className="text-xs text-blue-600">PayPal, Credit/Debit Card, Apple Pay, Google Pay</p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Always render the PayPal container */}
        <div 
          ref={paypalRef} 
          className="paypal-button-container w-full min-h-[50px]"
          id="paypal-buttons-container"
        />
        
        {/* Show loading overlay when needed */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-50 rounded-lg border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading payment options...</span>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Secure payments powered by PayPal. Your payment information is encrypted and secure.
        </p>
      </div>
    </div>
  );
}