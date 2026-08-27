import type { SupabaseClient } from "@supabase/supabase-js";

import { ApplicationError } from "@/application/errors/application-error";
import { createDemoApplication, type GuidedRunState } from "@/application/demo/create-demo-application";
import type { DemoResolutionService } from "@/application/resolution/demo-resolution-service";
import { createClient } from "@/lib/supabase/server";
import { guidedRunRowSchema, type GuidedRunRow } from "@/persistence/schemas";

type GuidedOutcome = GuidedRunRow["outcome"];

function outcome(state: GuidedRunState): GuidedOutcome {
  return state.workflow.assessments.at(-1)?.status ?? "IN_PROGRESS";
}

function persistenceFailure(): ApplicationError {
  return new ApplicationError("CONFLICT", "The private Guided Ravi history could not be updated. Reload and try again.");
}

async function insertRun(
  supabase: SupabaseClient,
  ownerUserId: string,
  application: DemoResolutionService,
): Promise<GuidedRunRow> {
  const state = application.snapshot();
  const { data, error } = await supabase.from("guided_runs").insert({
    run_id: `guided_run_${crypto.randomUUID()}`,
    owner_user_id: ownerUserId,
    revision: 1,
    outcome: outcome(state),
    state,
  }).select("*").single();
  if (error) throw persistenceFailure();
  return guidedRunRowSchema.parse(data);
}

async function latestRun(supabase: SupabaseClient, ownerUserId: string): Promise<GuidedRunRow | null> {
  const { data, error } = await supabase
    .from("guided_runs")
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw persistenceFailure();
  return data ? guidedRunRowSchema.parse(data) : null;
}

async function updateRun(
  supabase: SupabaseClient,
  row: GuidedRunRow,
  application: DemoResolutionService,
): Promise<void> {
  const state = application.snapshot();
  const { data, error } = await supabase
    .from("guided_runs")
    .update({
      revision: row.revision + 1,
      outcome: outcome(state),
      state,
      updated_at: new Date().toISOString(),
    })
    .eq("run_id", row.run_id)
    .eq("owner_user_id", row.owner_user_id)
    .eq("revision", row.revision)
    .select("run_id")
    .maybeSingle();
  if (error || !data) throw persistenceFailure();
}

export async function createGuidedRun<T>(
  ownerUserId: string,
  action: (application: DemoResolutionService) => T,
): Promise<T> {
  const supabase = await createClient();
  const application = createDemoApplication();
  const result = action(application);
  await insertRun(supabase, ownerUserId, application);
  return result;
}

export async function withLatestGuidedRun<T>(
  ownerUserId: string,
  action: (application: DemoResolutionService) => T,
): Promise<T> {
  const supabase = await createClient();
  let row = await latestRun(supabase, ownerUserId);
  if (!row) {
    const initial = createDemoApplication();
    initial.resetDemo();
    row = await insertRun(supabase, ownerUserId, initial);
  }
  const application = createDemoApplication(row.state);
  const result = action(application);
  await updateRun(supabase, row, application);
  return result;
}

export async function listGuidedRuns(ownerUserId: string): Promise<readonly GuidedRunRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guided_runs")
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw persistenceFailure();
  return guidedRunRowSchema.array().parse(data);
}

export async function deleteGuidedRun(ownerUserId: string, runId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("guided_runs").delete().eq("owner_user_id", ownerUserId).eq("run_id", runId);
  if (error) throw persistenceFailure();
}

export async function deleteAllGuidedRuns(ownerUserId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("guided_runs").delete().eq("owner_user_id", ownerUserId);
  if (error) throw persistenceFailure();
}
