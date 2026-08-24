import { beforeEach, describe, expect, it } from "vitest";

import { POST as assess } from "@/app/api/v1/assessments/route";
import { GET as getAssessment } from "@/app/api/v1/assessments/[assessmentId]/route";
import { POST as reset } from "@/app/api/v1/demo/reset/route";
import { GET as getIssue } from "@/app/api/v1/issues/[issueId]/route";
import { GET as getAudit } from "@/app/api/v1/members/[memberId]/audit-events/route";
import { POST as openResolution } from "@/app/api/v1/resolutions/route";
import { POST as applySimulation } from "@/app/api/v1/resolutions/[resolutionId]/apply-simulation/route";
import { POST as confirmSimulation } from "@/app/api/v1/resolutions/[resolutionId]/confirm-simulation/route";
import { POST as selectAction } from "@/app/api/v1/resolutions/[resolutionId]/select-action/route";

const jsonRequest = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const params = <T extends Record<string, string>>(value: T) => ({ params: Promise.resolve(value) });

async function resetDemo() {
  const response = await reset(new Request("http://localhost/api/v1/demo/reset", { method: "POST" }));
  expect(response.status).toBe(200);
  return response.json();
}

describe("PF Health demo API", () => {
  beforeEach(async () => {
    await resetDemo();
  });

  it("completes the validated deterministic 4/5 to 5/5 journey", async () => {
    const assessmentResponse = await assess(
      jsonRequest("http://localhost/api/v1/assessments", {
        memberId: "demo_ravi",
        workflow: { type: "GENERAL_HEALTH" },
        expectedSnapshotVersion: 1,
      }),
    );
    expect(assessmentResponse.status).toBe(200);
    expect(assessmentResponse.headers.get("cache-control")).toBe("no-store");
    const { assessment } = await assessmentResponse.json();
    expect(assessment).toMatchObject({
      status: "NEEDS_ATTENTION",
      passedChecks: 4,
      failedChecks: 1,
      totalChecks: 5,
    });

    const storedAssessment = await getAssessment(
      new Request(`http://localhost/api/v1/assessments/${assessment.assessmentId}`),
      params({ assessmentId: assessment.assessmentId }),
    );
    expect((await storedAssessment.json()).assessment.assessmentId).toBe(
      assessment.assessmentId,
    );

    const issueId = assessment.issues[0].issueId as string;
    const issueResponse = await getIssue(
      new Request(`http://localhost/api/v1/issues/${issueId}`),
      params({ issueId }),
    );
    const issueDetail = await issueResponse.json();
    expect(issueDetail.copy).toMatchObject({
      source: "DETERMINISTIC_FALLBACK",
      title: "Your previous employment is missing exit information.",
    });
    expect(issueDetail.sources.map(({ sourceId }: { sourceId: string }) => sourceId)).toEqual([
      "SRC-001",
      "SRC-002",
    ]);

    const openedResponse = await openResolution(
      jsonRequest("http://localhost/api/v1/resolutions", {
        memberId: "demo_ravi",
        issueId,
        expectedSnapshotVersion: 1,
      }),
    );
    expect(openedResponse.status).toBe(201);
    const opened = await openedResponse.json();
    const resolutionId = opened.resolution.resolutionId as string;

    const selectedResponse = await selectAction(
      jsonRequest("http://localhost/select-action", {
        actionCode: "SIMULATE_EXIT_UPDATE",
      }),
      params({ resolutionId }),
    );
    expect((await selectedResponse.json()).resolution.status).toBe("ACTION_SELECTED");

    const proposedChange = {
      employmentId: "employment_previous_01",
      expectedSnapshotVersion: 1,
      exitDate: "2025-06-30",
      exitReason: "CESSATION_SHORT_SERVICE",
    };
    const confirmationResponse = await confirmSimulation(
      jsonRequest("http://localhost/confirm", proposedChange),
      params({ resolutionId }),
    );
    const { confirmation } = await confirmationResponse.json();
    expect(confirmation).toMatchObject({
      disclaimer: "SYNTHETIC_DEMO_ONLY",
      proposedChanges: {
        employmentId: proposedChange.employmentId,
        exitDate: proposedChange.exitDate,
        exitReason: proposedChange.exitReason,
      },
    });

    const appliedResponse = await applySimulation(
      jsonRequest("http://localhost/apply", {
        ...proposedChange,
        memberId: "demo_ravi",
        confirmationToken: confirmation.confirmationToken,
      }),
      params({ resolutionId }),
    );
    expect(appliedResponse.status).toBe(200);
    const applied = await appliedResponse.json();
    expect(applied).toMatchObject({
      member: { snapshotVersion: 2 },
      beforeAssessment: { passedChecks: 4, totalChecks: 5 },
      assessment: { status: "HEALTHY", passedChecks: 5, failedChecks: 0 },
      resolution: { status: "REVALIDATED" },
    });

    const auditResponse = await getAudit(
      new Request("http://localhost/api/v1/members/demo_ravi/audit-events"),
      params({ memberId: "demo_ravi" }),
    );
    const audit = await auditResponse.json();
    expect(audit.events.map(({ type }: { type: string }) => type)).toContain(
      "REVALIDATION_COMPLETED",
    );

    const resetResult = await resetDemo();
    expect(resetResult).toMatchObject({
      member: { snapshotVersion: 1 },
      assessment: { status: "NEEDS_ATTENTION", passedChecks: 4 },
    });
  });

  it("rejects unknown request fields with a stable validation envelope", async () => {
    const response = await assess(
      jsonRequest("http://localhost/api/v1/assessments", {
        memberId: "demo_ravi",
        workflow: { type: "GENERAL_HEALTH" },
        expectedSnapshotVersion: 1,
        uan: "not-accepted",
      }),
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request body is invalid.",
      },
    });
    expect(payload.error.requestId).toMatch(/^request_/);
    expect(JSON.stringify(payload)).not.toContain("stack");
  });

  it("maps stale snapshots, unsupported actions, and missing resources", async () => {
    const stale = await assess(
      jsonRequest("http://localhost/api/v1/assessments", {
        memberId: "demo_ravi",
        workflow: { type: "GENERAL_HEALTH" },
        expectedSnapshotVersion: 2,
      }),
    );
    expect(stale.status).toBe(409);
    expect((await stale.json()).error.code).toBe("CONFLICT");

    const resetPayload = await resetDemo();
    const issueId = resetPayload.assessment.issues[0].issueId as string;
    const openedResponse = await openResolution(
      jsonRequest("http://localhost/api/v1/resolutions", {
        memberId: "demo_ravi",
        issueId,
        expectedSnapshotVersion: 1,
      }),
    );
    const { resolution } = await openedResponse.json();
    const unsupported = await selectAction(
      jsonRequest("http://localhost/select-action", {
        actionCode: "DELETE_MEMBER_RECORD",
      }),
      params({ resolutionId: resolution.resolutionId }),
    );
    expect(unsupported.status).toBe(422);
    expect((await unsupported.json()).error.code).toBe("UNSUPPORTED_ACTION");

    const missing = await getIssue(
      new Request("http://localhost/api/v1/issues/missing"),
      params({ issueId: "missing" }),
    );
    expect(missing.status).toBe(404);
    expect((await missing.json()).error.code).toBe("NOT_FOUND");
  });
});
