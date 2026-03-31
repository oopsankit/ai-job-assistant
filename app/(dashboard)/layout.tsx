import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch user profile for plan badge
  const { data: profile } = await supabase
    .from("users")
    .select("plan, email")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <TopBar
          userEmail={profile?.email ?? session.user.email ?? ""}
          plan={profile?.plan ?? "free"}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
