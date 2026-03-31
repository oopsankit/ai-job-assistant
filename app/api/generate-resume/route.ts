import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateTailoredResume } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userResume, jobDescription, jobTitle, company } = body;

    if (!userResume?.trim()) {
      return NextResponse.json({ error: "userResume is required" }, { status: 400 });
    }
    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: "jobDescription is required" }, { status: 400 });
    }
    if (userResume.length > 8000) {
      return NextResponse.json({ error: "Resume too long (max 8000 chars)" }, { status: 400 });
    }

    const resume = await generateTailoredResume(userResume, jobDescription, jobTitle, company);

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("[generate-resume] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
