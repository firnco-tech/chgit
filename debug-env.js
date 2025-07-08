// Temporary debugging script to check Stripe environment variables
console.log("=== ENVIRONMENT VARIABLE DEBUG ===");

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripePublic = process.env.VITE_STRIPE_PUBLIC_KEY;
const stripePublishable = process.env.STRIPE_PUBLISHABLE_KEY;

console.log("STRIPE_SECRET_KEY prefix:", stripeSecret ? stripeSecret.substring(0, 8) + "***" : "NOT_FOUND");
console.log("VITE_STRIPE_PUBLIC_KEY prefix:", stripePublic ? stripePublic.substring(0, 8) + "***" : "NOT_FOUND");
console.log("STRIPE_PUBLISHABLE_KEY prefix:", stripePublishable ? stripePublishable.substring(0, 8) + "***" : "NOT_FOUND");

// Check if keys are live or test
if (stripeSecret) {
  console.log("Secret key type:", stripeSecret.startsWith('sk_live_') ? "LIVE" : "TEST");
}
if (stripePublic) {
  console.log("Public key type:", stripePublic.startsWith('pk_live_') ? "LIVE" : "TEST");
}

console.log("=== END DEBUG ===");