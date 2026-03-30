import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateTailoredResume } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyResumeGenerated } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user plan for rate limiting
    const { data: profile } = await supabase
      .from("users")
      .select("plan, whatsapp_number")
      .eq("id", userId)
      .single();

    const isPro = profile?.plan === "pro";

    // Rate limit check
    const { allowed, remaining, limit } = checkRateLimit(userId, isPro);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily generation limit reached (${limit}/day on Free plan). Upgrade to Pro for unlimited generations.`,
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json();
    const { userResume, jobDescription, jobTitle, company } = body;

    // Input validation
    if (!userResume?.trim()) {
      return NextResponse.json({ error: "userResume is required" }, { status: 400 });
    }
    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "jobDescription is required" }, { status: 400 });
    }
    if (userResume.length > 8000) {
      return NextResponse.json({ error: "Resume too long (max 8000 chars)" }, { status: 400 });
    }

    // Generate with OpenAI
    const resume = await generateTailoredResume(userResume, jobDescription, jobTitle, company);

    // WhatsApp notification (Pro plan users with a number set)
    if (isPro && profile?.whatsapp_number) {
      await notifyResumeGenerated(profile.whatsapp_number, jobTitle, company);
    }

    return NextResponse.json(
      { resume },
      {
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("[generate-resume] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
