import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import ApplicationsClient from "./ApplicationsClient";

export default async function ApplicationsPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: applications } = await supabase
    .from("applications")
    .select("*, job:jobs(id, title, company, location, apply_link)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track every application from saved to offer.
        </p>
      </div>
      <ApplicationsClient initialApplications={applications ?? []} />
    </div>
  );
}
