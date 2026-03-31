import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the service role key.
 * NEVER expose this on the client. Only use in server-side code.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
