import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/202608270001_user_history.sql", "utf8");

describe("Supabase ownership migration", () => {
  it("keys both persistent aggregates to auth.users with cascading deletion", () => {
    expect(migration.match(/owner_user_id uuid not null references auth\.users\(id\) on delete cascade/g)).toHaveLength(2);
  });

  it("enables RLS and defines each owner-scoped operation", () => {
    expect(migration).toContain("alter table public.guided_runs enable row level security");
    expect(migration).toContain("alter table public.laboratory_sessions enable row level security");
    for (const table of ["guided_runs", "laboratory_sessions"]) {
      for (const operation of ["select", "insert", "update", "delete"]) {
        expect(migration).toContain(`create policy ${table}_${operation}_own`);
      }
    }
    expect(migration.match(/auth\.uid\(\)/g)?.length).toBeGreaterThanOrEqual(12);
  });

  it("revokes anonymous access before granting authenticated operations", () => {
    expect(migration).toContain("revoke all on table public.guided_runs from anon, authenticated");
    expect(migration).toContain("revoke all on table public.laboratory_sessions from anon, authenticated");
    expect(migration).not.toContain("grant select on table public.guided_runs to anon");
  });
});
