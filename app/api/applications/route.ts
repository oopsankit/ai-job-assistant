import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * GET /api/applications
 * Returns the current user's applications.
 */
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*, job:jobs(id, title, company, location, apply_link)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error("[applications] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

/**
 * POST /api/applications
 * Save a new application (job + optional resume/message).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, resumeText, coldMessage, status = "saved", notes } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // Check if application already exists
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("job_id", jobId)
      .single();

    if (existing) {
      // Update instead of creating a duplicate
      const { data, error } = await supabase
        .from("applications")
        .update({
          resume_text: resumeText ?? null,
          cold_message: coldMessage ?? null,
          status,
          notes: notes ?? null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ application: data });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: session.user.id,
        job_id: jobId,
        resume_text: resumeText ?? null,
        cold_message: coldMessage ?? null,
        status,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ application: data }, { status: 201 });
  } catch (error) {
    console.error("[applications] POST error:", error);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }
}
