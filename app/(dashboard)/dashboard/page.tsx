import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Briefcase, ClipboardList, Zap, TrendingUp, ArrowRight } from "lucide-react";
import { ApplicationStatus } from "@/types";

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  saved:     "bg-gray-100 text-gray-700",
  applied:   "bg-blue-50 text-blue-700",
  interview: "bg-purple-50 text-purple-700",
  rejected:  "bg-red-50 text-red-700",
  offer:     "bg-green-50 text-green-700",
};

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Fetch stats in parallel
  const [{ count: jobCount }, { data: applications }, { data: profile }] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("id, status, created_at, job:jobs(title, company)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("users").select("plan, email").eq("id", userId).single(),
  ]);

  const appliedCount = applications?.filter((a) => a.status !== "saved").length ?? 0;
  const interviewCount = applications?.filter((a) => a.status === "interview").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{profile?.email ? `, ${profile.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s your job search overview.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Jobs Available", value: jobCount ?? 0, icon: Briefcase, color: "text-blue-600 bg-blue-50" },
          { label: "Applications", value: applications?.length ?? 0, icon: ClipboardList, color: "text-purple-600 bg-purple-50" },
          { label: "Applied", value: appliedCount, icon: Zap, color: "text-amber-600 bg-amber-50" },
          { label: "Interviews", value: interviewCount, icon: TrendingUp, color: "text-green-600 bg-green-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free plan upgrade banner */}
      {profile?.plan === "free" && (
        <div className="rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 p-5 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-semibold">Upgrade to Pro</p>
            <p className="text-sm text-blue-100 mt-0.5">
              Unlimited AI generations, WhatsApp notifications & more.
            </p>
          </div>
          <Link
            href="/api/stripe/create-checkout"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-blue-50 transition-colors"
          >
            Upgrade Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/jobs" className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
            <Briefcase className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Browse Jobs</p>
            <p className="text-sm text-gray-500">{jobCount ?? 0} open positions</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
        </Link>
        <Link href="/applications" className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
            <ClipboardList className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Applications</p>
            <p className="text-sm text-gray-500">{applications?.length ?? 0} tracked</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
        </Link>
      </div>

      {/* Recent applications */}
      {(applications?.length ?? 0) > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/applications" className="text-xs text-brand-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {applications?.map((app) => {
              const job = app.job as { title: string; company: string } | null;
              return (
                <div key={app.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job?.title ?? "Unknown Role"}</p>
                    <p className="text-xs text-gray-500">{job?.company ?? ""}</p>
                  </div>
                  <span className={`badge ${STATUS_COLOR[app.status as ApplicationStatus] ?? STATUS_COLOR.saved}`}>
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
