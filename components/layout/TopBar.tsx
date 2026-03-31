"use client";

interface TopBarProps {
  userEmail: string;
}

export default function TopBar({ userEmail }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold uppercase">
          {userEmail?.[0] ?? "U"}
        </div>
      </div>
    </header>
  );
}
