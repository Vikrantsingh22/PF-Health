import { ApplicationError } from "@/application/errors/application-error";
import { evaluateLaboratory } from "@/laboratory/evaluate";
import { laboratoryPreset } from "@/laboratory/presets";
import { laboratoryScenarioSchema } from "@/laboratory/schemas";
import type { LaboratoryAuditEvent, LaboratoryScenario, LaboratorySession, SyntheticAccountGroup } from "@/laboratory/types";

function event(type: LaboratoryAuditEvent["type"], detail: string): LaboratoryAuditEvent { return { eventId: `lab_event_${crypto.randomUUID()}`, type, occurredAt: new Date().toISOString(), detail }; }

export class LaboratoryService {
  private readonly sessions = new Map<string, LaboratorySession>();

  constructor(initialSessions: readonly LaboratorySession[] = []) {
    for (const session of initialSessions) {
      this.sessions.set(session.sessionId, structuredClone(session));
    }
  }

  create(input: { presetId?: string; scenario?: LaboratoryScenario }): LaboratorySession {
    const preset = input.scenario ? undefined : laboratoryPreset(input.presetId);
    if (!input.scenario && !preset) throw new ApplicationError("NOT_FOUND", "Laboratory preset not found");
    const scenario = laboratoryScenarioSchema.parse(input.scenario ?? preset?.scenario);
    const imported = Boolean(input.scenario);
    const session: LaboratorySession = { sessionId: `lab_session_${crypto.randomUUID()}`, presetId: imported ? "imported" : preset!.presetId, draftVersion: 1, snapshotVersion: 0, draft: structuredClone(scenario), assessment: null, auditEvents: [event("SESSION_CREATED", "Synthetic laboratory session created"), event(imported ? "SCENARIO_IMPORTED" : "PRESET_LOADED", imported ? "Version 1 scenario imported" : `${preset!.label} loaded`)] };
    this.sessions.set(session.sessionId, session); return structuredClone(session);
  }

  get(sessionId: string): LaboratorySession { const session = this.sessions.get(sessionId); if (!session) throw new ApplicationError("NOT_FOUND", "Laboratory session not found"); return structuredClone(session); }
  private mutable(sessionId: string): LaboratorySession { const session = this.sessions.get(sessionId); if (!session) throw new ApplicationError("NOT_FOUND", "Laboratory session not found"); return session; }
  private expect(session: LaboratorySession, draftVersion: number, snapshotVersion?: number) { if (session.draftVersion !== draftVersion) throw new ApplicationError("CONFLICT", "The laboratory draft has changed; reload before continuing"); if (snapshotVersion !== undefined && session.snapshotVersion !== snapshotVersion) throw new ApplicationError("CONFLICT", "The assessment snapshot has changed; rerun before continuing"); }

  updateDraft(sessionId: string, expectedDraftVersion: number, scenario: LaboratoryScenario): LaboratorySession { const session = this.mutable(sessionId); this.expect(session, expectedDraftVersion); session.draft = structuredClone(laboratoryScenarioSchema.parse(scenario)); session.draftVersion += 1; session.assessment = null; return structuredClone(session); }
  run(sessionId: string, expectedDraftVersion: number, revalidation = false): LaboratorySession { const session = this.mutable(sessionId); this.expect(session, expectedDraftVersion); session.snapshotVersion += 1; session.assessment = evaluateLaboratory(session.draft, session.snapshotVersion); session.auditEvents.push(event(revalidation ? "REVALIDATION" : "ASSESSMENT_RUN", `${session.assessment.ruleSet} returned ${session.assessment.outcome}`)); return structuredClone(session); }

  simulateExit(sessionId: string, input: { expectedDraftVersion: number; expectedSnapshotVersion: number; employmentId: string; exitDate: string; exitReason: LaboratoryScenario["employments"][number]["exitReason"] }): LaboratorySession {
    const session = this.mutable(sessionId); this.expect(session, input.expectedDraftVersion, input.expectedSnapshotVersion); const employment = session.draft.employments.find(({ employmentId }) => employmentId === input.employmentId); if (!employment || employment.status !== "PREVIOUS") throw new ApplicationError("VALIDATION_ERROR", "Select a previous synthetic employment"); employment.exitDate = input.exitDate; employment.exitReason = input.exitReason; laboratoryScenarioSchema.parse(session.draft); session.draftVersion += 1; session.auditEvents.push(event("SIMULATED_MUTATION", `Exit fields updated for ${employment.employerLabel}`)); return this.run(sessionId, session.draftVersion, true);
  }

  simulateAccountLink(sessionId: string, input: { expectedDraftVersion: number; expectedSnapshotVersion: number; targetAccountGroup: SyntheticAccountGroup }): LaboratorySession { const session = this.mutable(sessionId); this.expect(session, input.expectedDraftVersion, input.expectedSnapshotVersion); session.draft.employments = session.draft.employments.map((employment) => ({ ...employment, accountGroup: input.targetAccountGroup })); session.draftVersion += 1; session.auditEvents.push(event("SIMULATED_MUTATION", `All employments reassigned to synthetic account ${input.targetAccountGroup}`)); return this.run(sessionId, session.draftVersion, true); }
  reset(sessionId: string, presetId = "clean-history"): LaboratorySession { const session = this.mutable(sessionId); const preset = laboratoryPreset(presetId); if (!preset) throw new ApplicationError("NOT_FOUND", "Laboratory preset not found"); session.presetId = presetId; session.draft = preset.scenario; session.draftVersion += 1; session.snapshotVersion = 0; session.assessment = null; session.auditEvents.push(event("RESET", `${preset.label} restored`)); return structuredClone(session); }
}
