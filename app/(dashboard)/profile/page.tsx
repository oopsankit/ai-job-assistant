"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data } = await supabase
        .from("users")
        .select("email, whatsapp_number")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setEmail(data.email ?? "");
        setWhatsapp(data.whatsapp_number ?? "");
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("users")
      .update({ whatsapp_number: whatsapp || null })
      .eq("id", session.user.id);

    setSaving(false);
    if (error) {
      setToast({ message: error.message, type: "error" });
    } else {
      setToast({ message: "Profile saved!", type: "success" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account and notification settings.</p>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              value={email}
              readOnly
              className="input pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Email cannot be changed here.</p>
        </div>

        <div>
          <label className="label">WhatsApp Number (optional)</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+91 98765 43210"
              className="input pl-10"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Include country code. We'll send job alerts and resume notifications via WhatsApp.
          </p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Spinner size="sm" className="text-white" /> : <Save className="h-4 w-4" />}
          Save Profile
        </button>
      </form>

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
