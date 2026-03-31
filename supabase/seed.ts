/**
 * Seed script – populates the jobs table with mock data.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json supabase/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { MOCK_JOBS } from "../lib/mock-jobs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("🌱 Seeding jobs table...");

  const { data, error } = await supabase
    .from("jobs")
    .upsert(MOCK_JOBS, { onConflict: "title,company", ignoreDuplicates: true })
    .select();

  if (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data?.length ?? 0} jobs successfully.`);
}

seed();
