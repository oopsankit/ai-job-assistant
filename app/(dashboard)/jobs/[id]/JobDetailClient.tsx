"use client";

import { useState } from "react";
import { Copy, Check, Wand2, MessageSquare, Bookmark } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import { Job } from "@/types";

interface Props {
  job: Job;
  userId: string;
}

type TabType = "resume" | "linkedin" | "email";

export default function JobDetailClient({ job, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("resume");
  const [userResume, setUserResume] = useState("");
  const [userBackground, setUserBackground] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleGenerate() {
    if (activeTab === "resume" && !userResume.trim()) {
      setToast({ message: "Please paste your base resume first.", type: "error" });
      return;
    }
    if ((activeTab === "linkedin" || activeTab === "email") && !userBackground.trim()) {
      setToast({ message: "Please describe your background first.", type: "error" });
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      let res: Response;
      if (activeTab === "resume") {
        res = await fetch("/api/generate-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userResume,
            jobDescription: job.description,
            jobTitle: job.title,
            company: job.company,
          }),
        });
      } else {
        res = await fetch("/api/generate-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userBackground,
            jobTitle: job.title,
            company: job.company,
            jobDescription: job.description,
            messageType: activeTab,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error ?? "Generation failed. Please try again.", type: "error" });
        return;
      }

      const result = data.resume ?? data.message ?? "";
      setOutput(result);
      setToast({ message: "Generated successfully! ✨", type: "success" });
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          resumeText: activeTab === "resume" ? output : null,
          coldMessage: activeTab !== "resume" ? output : null,
          status: "saved",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ message: data.error ?? "Failed to save.", type: "error" });
      } else {
        setToast({ message: "Saved to your applications!", type: "success" });
      }
    } catch {
      setToast({ message: "Network error.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const TABS: { id: TabType; label: string; Icon: React.ElementType }[] = [
    { id: "resume",   label: "AI Resume",          Icon: Wand2         },
    { id: "linkedin", label: "LinkedIn Message",   Icon: MessageSquare },
    { id: "email",    label: "HR Email",           Icon: MessageSquare },
  ];

  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold text-gray-900">✨ AI Generation Tools</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setOutput(""); }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-white text-brand-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      {activeTab === "resume" ? (
        <div>
          <label className="label">Your Base Resume</label>
          <textarea
            value={userResume}
            onChange={(e) => setUserResume(e.target.value)}
            rows={8}
            placeholder="Paste your current resume here. Include your work experience, skills, education, and projects…"
            className="input resize-none font-mono text-xs"
          />
        </div>
      ) : (
        <div>
          <label className="label">Your Background (2-3 sentences)</label>
          <textarea
            value={userBackground}
            onChange={(e) => setUserBackground(e.target.value)}
            rows={4}
            placeholder="e.g. I'm a full-stack engineer with 4 years of experience in React and Node.js, having built SaaS products used by 10k+ users…"
            className="input resize-none"
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <Spinner size="sm" className="text-white" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Generate {activeTab === "resume" ? "Tailored Resume" : activeTab === "linkedin" ? "LinkedIn Message" : "HR Email"}
          </>
        )}
      </button>

      {/* Output */}
      {output && (
        <div className="space-y-3">
          <div className="relative">
            <label className="label">Generated Output</label>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={14}
              className="input resize-y font-mono text-xs"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary flex-1">
              {copied ? (
                <><Check className="h-4 w-4 text-green-600" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy</>
              )}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <><Bookmark className="h-4 w-4" /> Save to Tracker</>
              )}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
