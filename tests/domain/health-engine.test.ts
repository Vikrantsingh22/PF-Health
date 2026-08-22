import { describe, expect, it } from "vitest";

import { evaluateHealth } from "@/application/assessment/health-engine";
import type { HealthEngineDependencies } from "@/application/assessment/health-engine";
import type { MemberState } from "@/domain/model/types";
import { raviAfterCorrection, raviBeforeCorrection } from "@/fixtures/ravi";

const EVALUATED_AT = "2026-08-23T00:00:00.000Z";

function dependencies(): HealthEngineDependencies {
  return {
    now: () => EVALUATED_AT,
    createAssessmentId: () => "assessment_test_01",
    createIssueId: () => "issue_test_01",
  };
}

describe("health engine", () => {
  it("produces the exact Ravi before-correction oracle", () => {
    const assessment = evaluateHealth(raviBeforeCorrection, "GENERAL_HEALTH", dependencies());

    expect(assessment.status).toBe("NEEDS_ATTENTION");
    expect(assessment.checks.map(({ checkId }) => checkId)).toEqual([
      "D001",
      "D002",
      "D003",
      "D004",
      "R001",
    ]);
    expect(assessment.passedChecks).toBe(4);
    expect(assessment.failedChecks).toBe(1);
    expect(assessment.unknownChecks).toBe(0);
    expect(assessment.totalChecks).toBe(5);
    expect(assessment.issues).toHaveLength(1);
    expect(assessment.issues[0]).toMatchObject({
      issueId: "issue_test_01",
      code: "MISSING_PREVIOUS_EMPLOYMENT_EXIT",
      ruleId: "R001",
      ruleVersion: 1,
      titleKey: "issues.missingPreviousEmploymentExit.title",
      fallbackCopyKey: "issues.missingPreviousEmploymentExit.fallback",
      severity: "ATTENTION",
      defaultOwner: "MEMBER",
      alternativeOwners: ["PREVIOUS_EMPLOYER"],
      fallbackOwner: "REVIEW_REQUIRED",
      affectedWorkflows: ["TRANSFER"],
      allowedActionCodes: [
        "REVIEW_MEMBER_MARK_EXIT_PATH",
        "DRAFT_PREVIOUS_EMPLOYER_REQUEST",
        "REQUEST_EPFO_REVIEW",
        "SIMULATE_EXIT_UPDATE",
      ],
      requiredEvidence: [
        "UNAMBIGUOUS_PREVIOUS_EMPLOYMENT",
        "MISSING_EXIT_DATE_OR_REASON",
      ],
      sourceIds: ["SRC-001", "SRC-002"],
      limitationKey: "issues.missingPreviousEmploymentExit.transferLimitation",
      affectedRecordIds: ["employment_previous_01"],
    });
  });

  it("produces the exact Ravi after-correction oracle", () => {
    const assessment = evaluateHealth(raviAfterCorrection, "GENERAL_HEALTH", dependencies());

    expect(assessment.status).toBe("HEALTHY");
    expect(assessment.passedChecks).toBe(5);
    expect(assessment.failedChecks).toBe(0);
    expect(assessment.unknownChecks).toBe(0);
    expect(assessment.totalChecks).toBe(5);
    expect(assessment.issues).toEqual([]);
    expect(assessment.memberSnapshotVersion).toBe(2);
  });

  it("uses review-required precedence when evidence is unknown and no issue exists", () => {
    const member: MemberState = {
      ...raviBeforeCorrection,
      employments: [raviBeforeCorrection.employments[1]],
    };
    const assessment = evaluateHealth(member, "GENERAL_HEALTH", dependencies());

    expect(assessment.status).toBe("REVIEW_REQUIRED");
    expect(assessment.issues).toEqual([]);
    expect(assessment.unknownChecks).toBe(1);
    expect(assessment.checks.at(-1)?.status).toBe("UNKNOWN");
  });

  it("creates one issue for multiple affected previous records", () => {
    const previous = raviBeforeCorrection.employments[0];
    const member: MemberState = {
      ...raviBeforeCorrection,
      employments: [
        previous,
        { ...previous, employmentId: "employment_previous_02" },
        raviBeforeCorrection.employments[1],
      ],
    };
    const assessment = evaluateHealth(member, "TRANSFER", dependencies());

    expect(assessment.issues).toHaveLength(1);
    expect(assessment.issues[0]?.affectedRecordIds).toEqual([
      "employment_previous_01",
      "employment_previous_02",
    ]);
  });

  it("keeps IDs, timestamps, versions, and aggregate counts deterministic", () => {
    const assessment = evaluateHealth(raviBeforeCorrection, "TRANSFER", dependencies());

    expect(assessment.assessmentId).toBe("assessment_test_01");
    expect(assessment.evaluatedAt).toBe(EVALUATED_AT);
    expect(assessment.memberSnapshotVersion).toBe(raviBeforeCorrection.snapshotVersion);
    expect(assessment.ruleSetVersion).toBe(1);
    expect(assessment.workflow).toEqual({ type: "TRANSFER" });
    expect(
      assessment.passedChecks + assessment.failedChecks + assessment.unknownChecks,
    ).toBe(assessment.totalChecks);
    expect(assessment.checks.every(({ evaluatedAt }) => evaluatedAt === EVALUATED_AT)).toBe(true);
  });
});
