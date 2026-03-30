"use client";

import { Bell, Crown } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  userEmail: string;
  plan: "free" | "pro";
}

export default function TopBar({ userEmail, plan }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Left: empty (sidebar handles branding) */}
      <div />

      {/* Right: plan badge + avatar */}
      <div className="flex items-center gap-3">
        {plan === "free" && (
          <Link
            href="/api/stripe/create-checkout"
            className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <Crown className="h-3.5 w-3.5" />
            Upgrade to Pro
          </Link>
        )}
        {plan === "pro" && (
          <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 border border-brand-200">
            <Crown className="h-3.5 w-3.5" />
            Pro
          </span>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold uppercase">
          {userEmail?.[0] ?? "U"}
        </div>
      </div>
    </header>
  );
}
