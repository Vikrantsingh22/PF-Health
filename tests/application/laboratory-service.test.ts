import { describe, expect, it } from "vitest";
import { LaboratoryService } from "@/laboratory/service";

describe("LaboratoryService", () => {
  it("runs and revalidates a confirmed missing-exit simulation", () => {
    const service = new LaboratoryService();
    const created = service.create({ presetId: "missing-exit" });
    const run = service.run(created.sessionId, created.draftVersion);
    expect(run.assessment?.outcome).toBe("NEEDS_ATTENTION");
    const fixed = service.simulateExit(created.sessionId, { expectedDraftVersion: run.draftVersion, expectedSnapshotVersion: run.snapshotVersion, employmentId: "lab_emp-a", exitDate: "2021-03-31", exitReason: "RESIGNATION" });
    expect(fixed.assessment?.outcome).toBe("HEALTHY");
    expect(fixed.auditEvents.at(-1)?.type).toBe("REVALIDATION");
  });

  it("rejects stale mutations", () => {
    const service = new LaboratoryService(); const created = service.create({});
    expect(() => service.run(created.sessionId, created.draftVersion + 1)).toThrow(/changed/);
  });

  it("exports and imports scenario data without runtime state", () => {
    const service = new LaboratoryService(); const created = service.create({ presetId: "overlap" });
    const imported = service.create({ scenario: JSON.parse(JSON.stringify(created.draft)) });
    expect(imported.assessment).toBeNull(); expect(imported.snapshotVersion).toBe(0); expect(imported.draft).toEqual(created.draft);
  });
});
