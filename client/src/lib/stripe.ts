import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

console.log('🔑 Loading Stripe with key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY.substring(0, 20) + '...');

// Create a timeout promise for Stripe loading
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Stripe loading timeout')), 10000);
});

// Load Stripe with timeout and proper error handling
export const stripePromise = Promise.race([
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY),
  timeoutPromise
]).then(stripe => {
  if (!stripe) {
    console.warn('⚠️ Stripe Elements blocked - falling back to hosted checkout');
    return null; // Return null instead of throwing
  }
  console.log('✅ Stripe loaded successfully');
  return stripe;
}).catch(error => {
  console.warn('⚠️ Stripe Elements unavailable - falling back to hosted checkout:', error.message);
  return null; // Return null instead of throwing
});
