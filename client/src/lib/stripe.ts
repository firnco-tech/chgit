import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

console.log('🔑 Loading Stripe with key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY.substring(0, 20) + '...');

// Standard Stripe initialization - no custom timeouts or wrappers
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Helper function to check if Stripe Elements is available
export const checkStripeElementsAvailable = async (): Promise<boolean> => {
  try {
    const stripe = await stripePromise;
    return stripe !== null;
  } catch (error) {
    console.warn('⚠️ Stripe Elements unavailable:', error);
    return false;
  }
};
