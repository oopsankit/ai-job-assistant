import Stripe from "stripe";

// Singleton stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default stripe;

export const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

/**
 * Create a Stripe Checkout session for upgrading to Pro.
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price: STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: `${returnUrl}/dashboard?upgrade=success`,
    cancel_url: `${returnUrl}/dashboard?upgrade=cancelled`,
  });

  return session.url!;
}

/**
 * Construct and verify a Stripe webhook event.
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
