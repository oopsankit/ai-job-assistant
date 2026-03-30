import { ApplicationStatus } from "@/types";

const CONFIG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  saved:     { label: "Saved",     bg: "bg-gray-100",   text: "text-gray-700",  dot: "bg-gray-400"  },
  applied:   { label: "Applied",   bg: "bg-blue-50",    text: "text-blue-700",  dot: "bg-blue-500"  },
  interview: { label: "Interview", bg: "bg-purple-50",  text: "text-purple-700",dot: "bg-purple-500"},
  rejected:  { label: "Rejected",  bg: "bg-red-50",     text: "text-red-700",   dot: "bg-red-500"   },
  offer:     { label: "Offer 🎉",  bg: "bg-green-50",   text: "text-green-700", dot: "bg-green-500" },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.saved;
  return (
    <span className={`badge ${cfg.bg} ${cfg.text}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cfg.dot} inline-block`} />
      {cfg.label}
    </span>
  );
}
