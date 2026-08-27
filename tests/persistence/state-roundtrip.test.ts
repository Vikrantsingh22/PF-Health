import { describe, expect, it } from "vitest";

import { createDemoApplication } from "@/application/demo/create-demo-application";
import { LaboratoryService } from "@/laboratory/service";
import { guidedRunStateSchema, laboratorySessionRowSchema } from "@/persistence/schemas";

describe("persistent aggregate boundaries", () => {
  it("rehydrates a Guided Ravi run without changing deterministic state", () => {
    const first = createDemoApplication();
    const reset = first.resetDemo();
    const state = guidedRunStateSchema.parse(first.snapshot());
    const restored = createDemoApplication(state);

    expect(restored.getMember(reset.member.memberId)).toEqual(reset.member);
    expect(restored.getAssessment(reset.assessment.assessmentId)).toEqual(reset.assessment);
    expect(restored.listAudit(reset.member.memberId).map(({ type }) => type)).toEqual([
      "DEMO_RESET",
      "MEMBER_LOADED",
      "ASSESSMENT_COMPLETED",
    ]);
  });

  it("rehydrates a Laboratory session with its snapshot and audit trace", () => {
    const first = new LaboratoryService();
    const created = first.create({ presetId: "compound-case" });
    const assessed = first.run(created.sessionId, created.draftVersion);
    const restored = new LaboratoryService([assessed]);
    const row = laboratorySessionRowSchema.parse({
      session_id: assessed.sessionId,
      owner_user_id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      revision: 1,
      preset_id: assessed.presetId,
      draft_version: assessed.draftVersion,
      snapshot_version: assessed.snapshotVersion,
      outcome: assessed.assessment?.outcome,
      session: restored.get(assessed.sessionId),
      created_at: "2026-08-27T12:00:00+00:00",
      updated_at: "2026-08-27T12:00:00+00:00",
    });

    expect(row.session.assessment?.outcome).toBe("BLOCKED");
    expect(row.session.auditEvents.at(-1)?.type).toBe("ASSESSMENT_RUN");
  });
});
