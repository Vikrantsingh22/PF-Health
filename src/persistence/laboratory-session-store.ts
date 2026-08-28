import type { SupabaseClient } from "@supabase/supabase-js";

import { ApplicationError } from "@/application/errors/application-error";
import { LaboratoryService } from "@/laboratory/service";
import type { LaboratorySession } from "@/laboratory/types";
import { createClient } from "@/lib/supabase/server";
import { laboratorySessionRowSchema, type LaboratorySessionRow } from "@/persistence/schemas";

function persistenceFailure(): ApplicationError {
  return new ApplicationError("CONFLICT", "The private Laboratory session could not be updated. Reload and try again.");
}

function values(ownerUserId: string, session: LaboratorySession) {
  return {
    owner_user_id: ownerUserId,
    preset_id: session.presetId,
    draft_version: session.draftVersion,
    snapshot_version: session.snapshotVersion,
    outcome: session.assessment?.outcome ?? "NOT_RUN",
    session,
  };
}

async function loadRow(supabase: SupabaseClient, ownerUserId: string, sessionId: string): Promise<LaboratorySessionRow> {
  const { data, error } = await supabase
    .from("laboratory_sessions")
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error) throw persistenceFailure();
  if (!data) throw new ApplicationError("NOT_FOUND", "Laboratory session not found");
  return laboratorySessionRowSchema.parse(data);
}

export async function createLaboratorySession(ownerUserId: string, input: Parameters<LaboratoryService["create"]>[0]) {
  const supabase = await createClient();
  const session = new LaboratoryService().create(input);
  const { error } = await supabase.from("laboratory_sessions").insert({
    session_id: session.sessionId,
    revision: 1,
    ...values(ownerUserId, session),
  });
  if (error) throw persistenceFailure();
  return session;
}

export async function getLaboratorySession(ownerUserId: string, sessionId: string) {
  const supabase = await createClient();
  return (await loadRow(supabase, ownerUserId, sessionId)).session;
}

export async function mutateLaboratorySession(
  ownerUserId: string,
  sessionId: string,
  action: (service: LaboratoryService) => LaboratorySession,
) {
  const supabase = await createClient();
  const row = await loadRow(supabase, ownerUserId, sessionId);
  const session = action(new LaboratoryService([row.session]));
  const { data, error } = await supabase
    .from("laboratory_sessions")
    .update({ revision: row.revision + 1, updated_at: new Date().toISOString(), ...values(ownerUserId, session) })
    .eq("owner_user_id", ownerUserId)
    .eq("session_id", sessionId)
    .eq("revision", row.revision)
    .select("session_id")
    .maybeSingle();
  if (error || !data) throw persistenceFailure();
  return session;
}

export async function listLaboratorySessions(ownerUserId: string): Promise<readonly LaboratorySessionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("laboratory_sessions")
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .gt("snapshot_version", 0)
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw persistenceFailure();
  return laboratorySessionRowSchema.array().parse(data);
}

export async function deleteLaboratorySession(ownerUserId: string, sessionId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("laboratory_sessions").delete().eq("owner_user_id", ownerUserId).eq("session_id", sessionId);
  if (error) throw persistenceFailure();
}

export async function deleteAllLaboratorySessions(ownerUserId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("laboratory_sessions").delete().eq("owner_user_id", ownerUserId);
  if (error) throw persistenceFailure();
}
