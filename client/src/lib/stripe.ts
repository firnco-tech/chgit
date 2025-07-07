import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

console.log('🔑 Loading Stripe with key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY.substring(0, 20) + '...');

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY).then(stripe => {
  if (!stripe) {
    console.error('❌ Failed to load Stripe - this may be due to ad blockers or network issues');
    throw new Error('Stripe failed to load. Please disable ad blockers and try again.');
  }
  console.log('✅ Stripe loaded successfully');
  return stripe;
}).catch(error => {
  console.error('❌ Stripe loading error:', error);
  throw error;
});
