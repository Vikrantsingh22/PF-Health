import { describe, expect, it } from "vitest";

import { MockEPFOAdapter } from "@/adapters/epfo/mock-epfo-adapter";
import { InMemoryWorkflowRepository } from "@/adapters/persistence/in-memory-workflow-repository";
import { createAuditEvent } from "@/application/audit/create-audit-event";
import { ApplicationError } from "@/application/errors/application-error";
import { DemoResolutionService } from "@/application/resolution/demo-resolution-service";
import type {
  ConfirmSimulationInput,
  DemoResolutionDependencies,
} from "@/application/resolution/demo-resolution-service";
import { raviBeforeCorrection } from "@/fixtures/ravi";

const MEMBER_ID = "demo_ravi";
const EMPLOYMENT_ID = "employment_previous_01";
const EXIT_DATE = "2025-06-30";
const EXIT_REASON = "CESSATION_SHORT_SERVICE";

function createHarness() {
  let sequence = 0;
  let currentTime = "2026-08-23T00:00:00.000Z";
  const dependencies: DemoResolutionDependencies = {
    now: () => currentTime,
    createId: (kind) => `${kind}_${String(++sequence).padStart(2, "0")}`,
  };
  const repository = new InMemoryWorkflowRepository();
  const service = new DemoResolutionService(
    new MockEPFOAdapter(),
    repository,
    dependencies,
  );

  return {
    repository,
    service,
    setTime: (value: string) => {
      currentTime = value;
    },
  };
}

function beginSimulation(service: DemoResolutionService) {
  const { assessment } = service.resetDemo();
  const issue = assessment.issues[0];
  if (issue === undefined) {
    throw new Error("Ravi reset fixture must contain the R001 issue");
  }
  const opened = service.openResolution({
    memberId: MEMBER_ID,
    issueId: issue.issueId,
    expectedSnapshotVersion: 1,
  });
  const selected = service.selectAction(opened.resolutionId, "SIMULATE_EXIT_UPDATE");
  return { assessment, resolution: selected };
}

function confirmationInput(resolutionId: string): ConfirmSimulationInput {
  return {
    resolutionId,
    employmentId: EMPLOYMENT_ID,
    expectedSnapshotVersion: 1,
    exitDate: EXIT_DATE,
    exitReason: EXIT_REASON,
  };
}

function expectApplicationError(action: () => unknown, code: ApplicationError["code"]): void {
  expect(action).toThrowError(ApplicationError);
  try {
    action();
  } catch (error) {
    expect(error).toMatchObject({ code });
  }
}

describe("deterministic resolution application", () => {
  it("completes the confirmed synthetic correction and automatically revalidates", () => {
    const { service } = createHarness();
    const { assessment, resolution } = beginSimulation(service);

    expect(service.getMember(MEMBER_ID)).toEqual(raviBeforeCorrection);
    const confirmation = service.confirmSimulation(confirmationInput(resolution.resolutionId));
    expect(confirmation).toMatchObject({
      disclaimer: "SYNTHETIC_DEMO_ONLY",
      proposedChanges: {
        employmentId: EMPLOYMENT_ID,
        exitDate: EXIT_DATE,
        exitReason: EXIT_REASON,
      },
    });

    const result = service.applySimulation({
      memberId: MEMBER_ID,
      resolutionId: resolution.resolutionId,
      employmentId: EMPLOYMENT_ID,
      expectedSnapshotVersion: 1,
      exitDate: EXIT_DATE,
      exitReason: EXIT_REASON,
      confirmationToken: confirmation.confirmationToken,
    });

    expect(result.beforeAssessment).toBe(assessment);
    expect(result.member.snapshotVersion).toBe(2);
    expect(result.member.employments[0]).toMatchObject({
      employmentId: EMPLOYMENT_ID,
      exitDate: EXIT_DATE,
      exitReason: EXIT_REASON,
    });
    expect(result.assessment).toMatchObject({
      memberSnapshotVersion: 2,
      status: "HEALTHY",
      passedChecks: 5,
      failedChecks: 0,
      totalChecks: 5,
      issues: [],
    });
    expect(result.resolution.status).toBe("REVALIDATED");
    expect(service.listAudit(MEMBER_ID).map(({ type }) => type)).toEqual([
      "DEMO_RESET",
      "MEMBER_LOADED",
      "ASSESSMENT_COMPLETED",
      "RESOLUTION_OPENED",
      "ACTION_SELECTED",
      "SIMULATION_CONFIRMED",
      "SYNTHETIC_CORRECTION_APPLIED",
      "REVALIDATION_COMPLETED",
    ]);
  });

  it("does not mutate member state when an action is only selected", () => {
    const { service } = createHarness();
    beginSimulation(service);
    expect(service.getMember(MEMBER_ID)).toEqual(raviBeforeCorrection);
  });

  it("rejects an action outside the issue taxonomy", () => {
    const { service } = createHarness();
    const { assessment } = service.resetDemo();
    const opened = service.openResolution({
      memberId: MEMBER_ID,
      issueId: assessment.issues[0]?.issueId ?? "missing",
      expectedSnapshotVersion: 1,
    });

    expectApplicationError(
      () => service.selectAction(opened.resolutionId, "DELETE_MEMBER_RECORD"),
      "UNSUPPORTED_ACTION",
    );
  });

  it("requires simulation confirmation before mutation", () => {
    const { service } = createHarness();
    const { resolution } = beginSimulation(service);

    expectApplicationError(
      () =>
        service.applySimulation({
          memberId: MEMBER_ID,
          resolutionId: resolution.resolutionId,
          employmentId: EMPLOYMENT_ID,
          expectedSnapshotVersion: 1,
          exitDate: EXIT_DATE,
          exitReason: EXIT_REASON,
          confirmationToken: "confirmation_missing",
        }),
      "CONFLICT",
    );
    expect(service.getMember(MEMBER_ID).snapshotVersion).toBe(1);
  });

  it("rejects stale snapshot versions", () => {
    const { service } = createHarness();
    const { resolution } = beginSimulation(service);

    expectApplicationError(
      () =>
        service.confirmSimulation({
          ...confirmationInput(resolution.resolutionId),
          expectedSnapshotVersion: 2,
        }),
      "CONFLICT",
    );
  });

  it("rejects invalid dates and wrong affected records", () => {
    const invalidDateHarness = createHarness();
    const invalidDateResolution = beginSimulation(invalidDateHarness.service).resolution;
    expectApplicationError(
      () =>
        invalidDateHarness.service.confirmSimulation({
          ...confirmationInput(invalidDateResolution.resolutionId),
          exitDate: "2025-02-30",
        }),
      "VALIDATION_ERROR",
    );

    const wrongRecordHarness = createHarness();
    const wrongRecordResolution = beginSimulation(wrongRecordHarness.service).resolution;
    expectApplicationError(
      () =>
        wrongRecordHarness.service.confirmSimulation({
          ...confirmationInput(wrongRecordResolution.resolutionId),
          employmentId: "employment_current_01",
        }),
      "VALIDATION_ERROR",
    );
  });

  it("binds a token to the exact member and proposed fields", () => {
    const { service } = createHarness();
    const { resolution } = beginSimulation(service);
    const confirmation = service.confirmSimulation(confirmationInput(resolution.resolutionId));

    expectApplicationError(
      () =>
        service.applySimulation({
          memberId: "demo_someone_else",
          resolutionId: resolution.resolutionId,
          employmentId: EMPLOYMENT_ID,
          expectedSnapshotVersion: 1,
          exitDate: EXIT_DATE,
          exitReason: EXIT_REASON,
          confirmationToken: confirmation.confirmationToken,
        }),
      "CONFLICT",
    );
    expectApplicationError(
      () =>
        service.applySimulation({
          memberId: MEMBER_ID,
          resolutionId: resolution.resolutionId,
          employmentId: EMPLOYMENT_ID,
          expectedSnapshotVersion: 1,
          exitDate: "2025-06-29",
          exitReason: EXIT_REASON,
          confirmationToken: confirmation.confirmationToken,
        }),
      "CONFLICT",
    );
  });

  it("rejects expired and replayed confirmation tokens", () => {
    const expiredHarness = createHarness();
    const expiredResolution = beginSimulation(expiredHarness.service).resolution;
    const expiredConfirmation = expiredHarness.service.confirmSimulation(
      confirmationInput(expiredResolution.resolutionId),
    );
    expiredHarness.setTime("2026-08-23T00:06:00.000Z");
    expectApplicationError(
      () =>
        expiredHarness.service.applySimulation({
          memberId: MEMBER_ID,
          resolutionId: expiredResolution.resolutionId,
          employmentId: EMPLOYMENT_ID,
          expectedSnapshotVersion: 1,
          exitDate: EXIT_DATE,
          exitReason: EXIT_REASON,
          confirmationToken: expiredConfirmation.confirmationToken,
        }),
      "CONFLICT",
    );

    const replayHarness = createHarness();
    const replayResolution = beginSimulation(replayHarness.service).resolution;
    const replayConfirmation = replayHarness.service.confirmSimulation(
      confirmationInput(replayResolution.resolutionId),
    );
    const command = {
      memberId: MEMBER_ID,
      resolutionId: replayResolution.resolutionId,
      employmentId: EMPLOYMENT_ID,
      expectedSnapshotVersion: 1,
      exitDate: EXIT_DATE,
      exitReason: EXIT_REASON,
      confirmationToken: replayConfirmation.confirmationToken,
    } as const;
    replayHarness.service.applySimulation(command);
    expectApplicationError(() => replayHarness.service.applySimulation(command), "CONFLICT");
  });

  it("reset restores the exact fixture after partial and complete journeys", () => {
    const partialHarness = createHarness();
    beginSimulation(partialHarness.service);
    const partialReset = partialHarness.service.resetDemo();
    expect(partialReset.member).toEqual(raviBeforeCorrection);
    expect(partialReset.assessment.status).toBe("NEEDS_ATTENTION");
    expect(partialHarness.service.listAudit(MEMBER_ID).map(({ type }) => type)).toEqual([
      "DEMO_RESET",
      "MEMBER_LOADED",
      "ASSESSMENT_COMPLETED",
    ]);

    const completeHarness = createHarness();
    const { resolution } = beginSimulation(completeHarness.service);
    const confirmation = completeHarness.service.confirmSimulation(
      confirmationInput(resolution.resolutionId),
    );
    completeHarness.service.applySimulation({
      memberId: MEMBER_ID,
      resolutionId: resolution.resolutionId,
      employmentId: EMPLOYMENT_ID,
      expectedSnapshotVersion: 1,
      exitDate: EXIT_DATE,
      exitReason: EXIT_REASON,
      confirmationToken: confirmation.confirmationToken,
    });
    expect(completeHarness.service.resetDemo().member).toEqual(raviBeforeCorrection);
  });

  it("rejects unsafe audit metadata keys", () => {
    expectApplicationError(
      () =>
        createAuditEvent({
          eventId: "audit_unsafe",
          memberId: MEMBER_ID,
          type: "DEMO_RESET",
          actor: "SYSTEM",
          occurredAt: "2026-08-23T00:00:00.000Z",
          metadata: { requestHeaders: "must-not-be-recorded" },
        }),
      "VALIDATION_ERROR",
    );
  });
});
