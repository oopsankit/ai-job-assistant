import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobCard from "@/components/jobs/JobCard";
import { Job } from "@/types";
import { Briefcase } from "lucide-react";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const q = searchParams.q?.trim() ?? "";

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: jobs } = await query;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {jobs?.length ?? 0} positions available
          </p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search by title, company, or skill…"
          className="input flex-1 max-w-md"
        />
        <button type="submit" className="btn-primary">Search</button>
        {q && (
          <a href="/jobs" className="btn-secondary">
            Clear
          </a>
        )}
      </form>

      {/* Grid */}
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job as Job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {q ? `No results for "${q}". Try a different search.` : "No jobs have been added yet."}
          </p>
        </div>
      )}
    </div>
  );
}
