import { notFound, redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { MapPin, DollarSign, ExternalLink } from "lucide-react";
import JobDetailClient from "./JobDetailClient";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const [{ data: job }] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", params.id).single(),
  ]);

  if (!job) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      {/* Job header card */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
              <span className="text-2xl font-bold text-brand-600 uppercase">
                {job.company?.[0] ?? "J"}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-0.5 text-base font-medium text-brand-600">{job.company}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                {job.salary_range && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" /> {job.salary_range}
                  </span>
                )}
              </div>
            </div>
          </div>
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
            Apply Directly
          </a>
        </div>

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag: string) => (
              <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mt-5">
          <h2 className="font-semibold text-gray-900 mb-2">Job Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      {/* AI Tools (client component) */}
      <JobDetailClient
        job={job}
        userId={session.user.id}
      />
    </div>
  );
}
