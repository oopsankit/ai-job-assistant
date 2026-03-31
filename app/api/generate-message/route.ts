import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { generateColdMessage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userBackground, jobTitle, company, jobDescription, messageType } = body;

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

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[generate-message] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
