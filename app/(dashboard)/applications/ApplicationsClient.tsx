"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, Trash2, ClipboardList, Eye } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import { Application, ApplicationStatus } from "@/types";

const STATUSES: ApplicationStatus[] = ["saved", "applied", "interview", "rejected", "offer"];

interface Props {
  initialApplications: Application[];
}

export default function ApplicationsClient({ initialApplications }: Props) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [viewApp, setViewApp] = useState<Application | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  async function updateStatus(appId: string, newStatus: ApplicationStatus) {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      setToast({ message: "Status updated!", type: "success" });
    } else {
      setToast({ message: "Failed to update status.", type: "error" });
    }
  }

  async function deleteApplication(appId: string) {
    if (!confirm("Delete this application?")) return;
    setDeletingId(appId);
    const res = await fetch(`/api/applications/${appId}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      setToast({ message: "Application deleted.", type: "success" });
    } else {
      setToast({ message: "Failed to delete.", type: "error" });
    }
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              filterStatus === s
                ? "bg-brand-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All" : s}
            <span className="ml-1.5 opacity-70">
              ({s === "all" ? applications.length : applications.filter((a) => a.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table / list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <ClipboardList className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse jobs and generate a resume to get started.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Job</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Company</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((app) => {
                const job = app.job as { id: string; title: string; company: string; apply_link: string } | null;
                return (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {job?.title ?? "Unknown Role"}
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      {job?.company ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="appearance-none rounded-full border-0 bg-transparent pr-5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-0"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <StatusBadge status={app.status} />
                        <ChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 opacity-0" />
                      </div>
                      {/* Clickable badge that triggers select */}
                      <div className="flex items-center gap-1">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="absolute opacity-0 w-20 cursor-pointer"
                          aria-label="Update status"
                        />
                        <StatusBadge status={app.status} />
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {app.resume_text && (
                          <button
                            onClick={() => setViewApp(app)}
                            title="View resume"
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {job?.apply_link && (
                          <a
                            href={job.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Apply"
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteApplication(app.id)}
                          disabled={deletingId === app.id}
                          title="Delete"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Resume viewer modal */}
      {viewApp && (
        <Modal
          isOpen={!!viewApp}
          onClose={() => setViewApp(null)}
          title={`Resume – ${(viewApp.job as { title?: string })?.title ?? "Application"}`}
          maxWidth="max-w-3xl"
        >
          <pre className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed font-mono">
            {viewApp.resume_text}
          </pre>
        </Modal>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
