import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * PATCH /api/applications/[id]
 * Update status or notes on an application.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, resume_text, cold_message } = body;

    // Build update payload – only include fields that were sent
    const update: Record<string, unknown> = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (resume_text !== undefined) update.resume_text = resume_text;
    if (cold_message !== undefined) update.cold_message = cold_message;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("applications")
      .update(update)
      .eq("id", params.id)
      .eq("user_id", session.user.id) // Ensure ownership
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ application: data });
  } catch (error) {
    console.error("[applications/id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete an application (only the owner can delete).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", params.id)
      .eq("user_id", session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[applications/id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
