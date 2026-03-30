"use client";

import Link from "next/link";
import { MapPin, DollarSign, ExternalLink, Zap } from "lucide-react";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="card hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="mt-0.5 text-sm font-medium text-brand-600">{job.company}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <span className="text-lg font-bold text-brand-600 uppercase">
            {job.company?.[0] ?? "J"}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
        )}
        {job.salary_range && (
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {job.salary_range}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {job.description}
      </p>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="badge bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-50 mt-auto">
        <Link href={`/jobs/${job.id}`} className="btn-primary flex-1 justify-center text-xs">
          <Zap className="h-3.5 w-3.5" />
          Generate Resume
        </Link>
        <a
          href={job.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-3"
          title="Apply directly"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
