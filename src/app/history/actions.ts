"use server";

import { revalidatePath } from "next/cache";

import { requireApiUser } from "@/lib/auth/current-user";
import { deleteAllGuidedRuns, deleteGuidedRun } from "@/persistence/guided-run-store";
import { deleteAllLaboratorySessions, deleteLaboratorySession } from "@/persistence/laboratory-session-store";

function requiredId(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || value.length < 4) throw new Error("Invalid history item");
  return value;
}

export async function deleteGuidedRunAction(formData: FormData) {
  const user = await requireApiUser();
  await deleteGuidedRun(user.id, requiredId(formData, "runId"));
  revalidatePath("/history");
}

export async function deleteLaboratorySessionAction(formData: FormData) {
  const user = await requireApiUser();
  await deleteLaboratorySession(user.id, requiredId(formData, "sessionId"));
  revalidatePath("/history");
}

export async function deleteAllHistoryAction() {
  const user = await requireApiUser();
  await Promise.all([deleteAllGuidedRuns(user.id), deleteAllLaboratorySessions(user.id)]);
  revalidatePath("/history");
}
