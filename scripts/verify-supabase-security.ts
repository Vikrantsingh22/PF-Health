import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const environment = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
}).parse(process.env);

async function main() {
  const supabase = createClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  for (const table of ["guided_runs", "laboratory_sessions"] as const) {
    const selected = await supabase.from(table).select("*");
    const permissionDenied = selected.error?.code === "42501";
    const emptyRlsResult = !selected.error && selected.data.length === 0;
    if (!permissionDenied && !emptyRlsResult) {
      throw new Error(`Anonymous reads are not safely isolated for ${table}`);
    }
  }

  const anonymousWrite = await supabase.from("guided_runs").insert({
    run_id: `security_probe_${crypto.randomUUID()}`,
    owner_user_id: crypto.randomUUID(),
    revision: 1,
    outcome: "IN_PROGRESS",
    state: {},
  });
  if (!anonymousWrite.error) {
    throw new Error("Anonymous writes unexpectedly reached guided_runs");
  }

  console.log("Supabase security verification passed: anonymous reads return no rows and anonymous writes are rejected.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Supabase security verification failed");
  process.exitCode = 1;
});
