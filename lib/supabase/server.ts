import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Server-side Supabase instance.
 * Use this in Server Components, Route Handlers, and Server Actions.
 */
export function createServerClient() {
  return createServerComponentClient({ cookies });
}
