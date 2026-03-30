import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback handler.
 * Supabase redirects here after Google sign-in.
 * It exchanges the code for a session and upserts the user profile.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Upsert user profile row on first login
    if (data.user) {
      await supabase.from("users").upsert(
        {
          id: data.user.id,
          email: data.user.email!,
          plan: "free",
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
