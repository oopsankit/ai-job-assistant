-- ================================================================
-- AI Job Assistant – Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- ── Enable UUID extension ──────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT NOT NULL UNIQUE,
  plan             TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  whatsapp_number  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── 2. JOBS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  company       TEXT NOT NULL,
  description   TEXT NOT NULL,
  apply_link    TEXT NOT NULL,
  location      TEXT,
  salary_range  TEXT,
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Jobs are readable by all authenticated users
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read jobs"
  ON public.jobs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role can insert/update/delete jobs (admin API uses service role key)
CREATE POLICY "Service role can manage jobs"
  ON public.jobs FOR ALL
  USING (auth.role() = 'service_role');

-- ── 3. APPLICATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id       UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  resume_text  TEXT,
  cold_message TEXT,
  status       TEXT NOT NULL DEFAULT 'saved'
                 CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'offer')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own applications"
  ON public.applications FOR ALL
  USING (auth.uid() = user_id);

-- ── 4. INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id  ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at      ON public.jobs(created_at DESC);

-- ── 5. AUTO-CREATE USER PROFILE ON SIGN UP ─────────────────────
-- This trigger fires after a new auth.users row is created (e.g. Google OAuth / email signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── 6. SEED MOCK JOBS (optional) ───────────────────────────────
-- Uncomment and run to seed sample jobs for development:
/*
INSERT INTO public.jobs (title, company, description, apply_link, location, salary_range, tags) VALUES
('Senior Frontend Engineer', 'Stripe', 'Join Stripe''s Growth team to build beautiful, fast, and accessible web experiences. You''ll work with React, TypeScript, and GraphQL to create products used by millions of developers worldwide.', 'https://stripe.com/jobs', 'Remote (US)', '$180k – $240k', ARRAY['React', 'TypeScript', 'GraphQL', 'Remote']),
('Full Stack Engineer', 'Linear', 'Linear is looking for a full-stack engineer to help build the next generation of project management tools. Stack: Node.js, PostgreSQL, React, TypeScript.', 'https://linear.app/jobs', 'Remote (Worldwide)', '$150k – $200k', ARRAY['Node.js', 'React', 'PostgreSQL', 'TypeScript']),
('AI / ML Engineer', 'Anthropic', 'Anthropic is an AI safety company. We''re hiring ML engineers to work on Claude and future models. Strong Python and PyTorch experience required.', 'https://anthropic.com/careers', 'San Francisco, CA', '$200k – $300k', ARRAY['Python', 'PyTorch', 'ML', 'AI Safety']),
('Backend Engineer – Platform', 'Vercel', 'Build the infrastructure that powers millions of web deployments. We''re looking for engineers who love performance, distributed systems, and Go / Rust.', 'https://vercel.com/careers', 'Remote (US/Europe)', '$160k – $220k', ARRAY['Go', 'Rust', 'Distributed Systems', 'Edge']),
('Product Designer', 'Figma', 'Design the future of collaborative design at Figma. Strong visual design skills, Figma proficiency, and user research experience required.', 'https://figma.com/careers', 'San Francisco, CA / Remote', '$160k – $210k', ARRAY['Product Design', 'Figma', 'UX Research', 'Prototyping']),
('DevOps / Platform Engineer', 'HashiCorp', 'Build and operate the infrastructure that powers Terraform Cloud, Vault, and Consul. Strong Kubernetes, AWS, and Terraform experience preferred.', 'https://hashicorp.com/jobs', 'Remote (US)', '$150k – $200k', ARRAY['Kubernetes', 'AWS', 'Terraform', 'DevOps']),
('iOS Engineer', 'Notion', 'Help shape the Notion iOS experience for millions of users. You''ll own features in Swift and SwiftUI with a focus on performance and offline-first architecture.', 'https://notion.so/careers', 'New York, NY / Remote', '$160k – $210k', ARRAY['Swift', 'SwiftUI', 'iOS', 'Mobile']),
('Data Engineer', 'Snowflake', 'Build scalable data pipelines and analytics infrastructure. You''ll work with petabyte-scale data, dbt, Airflow, and Spark.', 'https://snowflake.com/careers', 'Remote (US)', '$140k – $190k', ARRAY['SQL', 'Python', 'dbt', 'Airflow', 'Data']);
*/
