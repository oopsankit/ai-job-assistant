// ─────────────────────────────────────────────────
// Database row types (mirrors Supabase schema)
// ─────────────────────────────────────────────────

export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  created_at: string;
  plan: Plan;
  whatsapp_number: string | null;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  apply_link: string;
  location: string;
  salary_range: string | null;
  tags: string[];
  created_at: string;
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interview"
  | "rejected"
  | "offer";

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_text: string | null;
  cold_message: string | null;
  status: ApplicationStatus;
  notes: string | null;
  created_at: string;
  job?: Job;
}

// ─────────────────────────────────────────────────
// API request / response types
// ─────────────────────────────────────────────────

export interface GenerateResumeRequest {
  userResume: string;
  jobDescription: string;
  jobTitle: string;
  company: string;
}

export interface GenerateResumeResponse {
  resume: string;
  error?: string;
}

export interface GenerateMessageRequest {
  userBackground: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  messageType: "linkedin" | "email";
}

export interface GenerateMessageResponse {
  message: string;
  error?: string;
}

export interface ApiError {
  error: string;
  code?: string;
}
