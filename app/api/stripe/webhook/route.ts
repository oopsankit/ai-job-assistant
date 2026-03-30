import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

// Disable body parsing – we need the raw body for signature verification
export const config = { api: { bodyParser: false } };

/**
 * POST /api/stripe/webhook
 * Handles Stripe events:
 * - checkout.session.completed  → upgrade user to Pro
 * - customer.subscription.deleted → downgrade user to Free
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId) {
          await adminSupabase
            .from("users")
            .update({ plan: "pro" })
            .eq("id", userId);
          console.log(`[stripe/webhook] User ${userId} upgraded to Pro`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        // When a subscription is cancelled/expired, downgrade to Free
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Look up user by Stripe customer email (simplest approach)
        // In production, store stripe_customer_id on the user row
        const { data: customers } = await (await import("@/lib/stripe")).default.customers.retrieve(customerId)
          .then(async (c) => {
            const customer = c as Stripe.Customer;
            return adminSupabase
              .from("users")
              .update({ plan: "free" })
              .eq("email", customer.email!);
          });

        console.log("[stripe/webhook] Subscription cancelled, user downgraded to Free");
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
