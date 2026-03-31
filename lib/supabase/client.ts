import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

/**
 * Client-side Supabase instance.
 * Use this in Client Components ("use client").
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
