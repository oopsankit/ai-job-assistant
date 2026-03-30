"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  User,
  LogOut,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard",     label: "Dashboard",    Icon: LayoutDashboard },
  { href: "/jobs",          label: "Browse Jobs",  Icon: Briefcase       },
  { href: "/applications",  label: "My Applications", Icon: ClipboardList },
  { href: "/profile",       label: "Profile",      Icon: User            },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
          <Zap className="h-4.5 w-4.5 text-white fill-white" size={18} />
        </div>
        <span className="text-lg font-bold text-gray-900">JobAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? "text-brand-600" : ""}`} size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
