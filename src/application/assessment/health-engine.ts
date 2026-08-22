import {
  evaluateD001,
  evaluateD002,
  evaluateD003,
  evaluateD004,
} from "@/application/assessment/demo-checks";
import { createMissingPreviousEmploymentExitIssue } from "@/domain/issues/issue-registry";
import type {
  AssessmentStatus,
  HealthAssessment,
  HealthCheckResult,
  Issue,
  IssueCode,
  MemberState,
  WorkflowType,
} from "@/domain/model/types";
import { evaluateR001 } from "@/domain/rules/r001";

export interface HealthEngineDependencies {
  readonly now: () => string;
  readonly createAssessmentId: () => string;
  readonly createIssueId: (code: IssueCode) => string;
}

function assessmentStatus(
  checks: readonly HealthCheckResult[],
  issues: readonly Issue[],
): AssessmentStatus {
  if (issues.some(({ severity }) => severity === "BLOCKER")) {
    return "BLOCKED";
  }

  if (issues.length > 0) {
    return "NEEDS_ATTENTION";
  }

  if (checks.some(({ status }) => status === "UNKNOWN")) {
    return "REVIEW_REQUIRED";
  }

  return "HEALTHY";
}

export function evaluateHealth(
  member: MemberState,
  workflowType: WorkflowType,
  dependencies: HealthEngineDependencies,
): HealthAssessment {
  const evaluatedAt = dependencies.now();
  const r001 = evaluateR001(member, evaluatedAt);
  const checks = Object.freeze([
    evaluateD001(member, evaluatedAt),
    evaluateD002(member, evaluatedAt),
    evaluateD003(member, evaluatedAt),
    evaluateD004(member, evaluatedAt),
    r001,
  ]);
  const issues = Object.freeze(
    r001.status === "FAIL"
      ? [
          createMissingPreviousEmploymentExitIssue(
            dependencies.createIssueId("MISSING_PREVIOUS_EMPLOYMENT_EXIT"),
            r001,
          ),
        ]
      : [],
  );
  const passedChecks = checks.filter(({ status }) => status === "PASS").length;
  const failedChecks = checks.filter(({ status }) => status === "FAIL").length;
  const unknownChecks = checks.filter(({ status }) => status === "UNKNOWN").length;

  return Object.freeze({
    assessmentId: dependencies.createAssessmentId(),
    memberId: member.memberId,
    memberSnapshotVersion: member.snapshotVersion,
    ruleSetVersion: 1,
    workflow: Object.freeze({ type: workflowType }),
    status: assessmentStatus(checks, issues),
    passedChecks,
    failedChecks,
    unknownChecks,
    totalChecks: checks.length,
    checks,
    issues,
    evaluatedAt,
  });
}
