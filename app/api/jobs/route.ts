import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/jobs
 * Returns paginated jobs. Requires authentication.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (q) {
      query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data: jobs, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({ jobs, total: count, page, limit });
  } catch (error) {
    console.error("[jobs] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

/**
 * POST /api/jobs
 * Admin-only: create a new job.
 * Notifies all Pro users with a WhatsApp number.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, company, description, apply_link, location, salary_range, tags } = body;

    if (!title || !company || !description || !apply_link) {
      return NextResponse.json(
        { error: "title, company, description, and apply_link are required" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const { data: job, error } = await adminSupabase
      .from("jobs")
      .insert({ title, company, description, apply_link, location, salary_range, tags: tags ?? [] })
      .select()
      .single();

    if (error) throw error;

    // WhatsApp notifications for Pro users (fire-and-forget)
    const { notifyNewJob } = await import("@/lib/twilio");
    adminSupabase
      .from("users")
      .select("whatsapp_number")
      .eq("plan", "pro")
      .not("whatsapp_number", "is", null)
      .then(({ data: proUsers }) => {
        proUsers?.forEach((u) => {
          if (u.whatsapp_number) {
            notifyNewJob(u.whatsapp_number, title, company);
          }
        });
      });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("[jobs] POST error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
