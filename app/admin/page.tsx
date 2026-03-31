import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Users, ClipboardList, Briefcase } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { ApplicationStatus } from "@/types";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Only allow the admin email defined in env
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!session || session.user.email !== adminEmail) {
    redirect("/dashboard");
  }

  const adminSupabase = createAdminClient();

  // Fetch all data in parallel using the service role client
  const [
    { data: users },
    { data: applications },
    { count: jobCount },
  ] = await Promise.all([
    adminSupabase.from("users").select("id, email, plan, created_at").order("created_at", { ascending: false }),
    adminSupabase
      .from("applications")
      .select("id, status, created_at, user_id, job:jobs(title, company), user:users(email)")
      .order("created_at", { ascending: false })
      .limit(50),
    adminSupabase.from("jobs").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">Admin Panel</span>
          <span className="badge bg-red-50 text-red-700">⚠️ Admin Only</span>
        </div>
        <Link href="/dashboard" className="text-sm text-brand-600 hover:underline font-medium">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Users",        value: users?.length ?? 0,        icon: Users,         color: "text-blue-600 bg-blue-50"   },
            { label: "Total Applications", value: applications?.length ?? 0, icon: ClipboardList, color: "text-purple-600 bg-purple-50"},
            { label: "Jobs Available",     value: jobCount ?? 0,             icon: Briefcase,     color: "text-green-600 bg-green-50" },
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

        {/* Users table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-900">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${user.plan === "pro" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Applications table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Job</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications?.map((app) => {
                  const job = app.job as { title: string; company: string } | null;
                  const user = app.user as { email: string } | null;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-600 text-xs">{user?.email ?? app.user_id.slice(0, 8)}</td>
                      <td className="px-5 py-3 text-gray-900 font-medium">{job?.title ?? "—"}</td>
                      <td className="px-5 py-3 text-gray-500">{job?.company ?? "—"}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={app.status as ApplicationStatus} />
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
