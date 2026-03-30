import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { sendWhatsAppMessage } from "@/lib/twilio";

/**
 * POST /api/notifications
 * Send a test WhatsApp message to the authenticated user's number.
 * Used to verify Twilio integration from the Profile page.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("plan, whatsapp_number")
      .eq("id", session.user.id)
      .single();

    if (profile?.plan !== "pro") {
      return NextResponse.json(
        { error: "WhatsApp notifications require Pro plan." },
        { status: 403 }
      );
    }

    if (!profile?.whatsapp_number) {
      return NextResponse.json(
        { error: "Please save a WhatsApp number in your profile first." },
        { status: 400 }
      );
    }

    await sendWhatsAppMessage(
      profile.whatsapp_number,
      "👋 *Test notification from AI Job Assistant!*\n\nYour WhatsApp notifications are set up correctly. You'll receive alerts for new jobs and generated resumes."
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[notifications] POST error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
