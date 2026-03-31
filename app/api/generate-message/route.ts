import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateColdMessage } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user plan
    const { data: profile } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    const isPro = profile?.plan === "pro";

    // Rate limit check (shared pool with resume generator)
    const { allowed, remaining, limit } = checkRateLimit(`${userId}_msg`, isPro);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily generation limit reached (${limit}/day on Free plan). Upgrade to Pro for unlimited.`,
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userBackground, jobTitle, company, jobDescription, messageType } = body;

    // Validate
    if (!userBackground?.trim()) {
      return NextResponse.json({ error: "userBackground is required" }, { status: 400 });
    }
    if (!["linkedin", "email"].includes(messageType)) {
      return NextResponse.json({ error: "messageType must be 'linkedin' or 'email'" }, { status: 400 });
    }

    const message = await generateColdMessage(
      userBackground,
      jobTitle,
      company,
      jobDescription,
      messageType
    );

    return NextResponse.json(
      { message },
      {
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("[generate-message] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
