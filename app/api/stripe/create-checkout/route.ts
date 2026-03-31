import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createCheckoutSession } from "@/lib/stripe";

/**
 * GET /api/stripe/create-checkout
 * Creates a Stripe Checkout session and redirects to the payment page.
 * Called when user clicks "Upgrade to Pro".
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

    const checkoutUrl = await createCheckoutSession(
      session.user.id,
      session.user.email!,
      appUrl
    );

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error("[stripe/create-checkout] Error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?upgrade=error", request.url)
    );
  }
}
