import type { HealthCheckResult, Issue } from "@/domain/model/types";

const ALLOWED_ACTION_CODES = Object.freeze([
  "REVIEW_MEMBER_MARK_EXIT_PATH",
  "DRAFT_PREVIOUS_EMPLOYER_REQUEST",
  "REQUEST_EPFO_REVIEW",
  "SIMULATE_EXIT_UPDATE",
] as const);

const REQUIRED_EVIDENCE = Object.freeze([
  "UNAMBIGUOUS_PREVIOUS_EMPLOYMENT",
  "MISSING_EXIT_DATE_OR_REASON",
] as const);

export function createMissingPreviousEmploymentExitIssue(
  issueId: string,
  check: HealthCheckResult,
): Issue {
  if (check.checkId !== "R001" || check.ruleVersion !== 1 || check.status !== "FAIL") {
    throw new Error("R001@1 must fail before its registered issue can be created");
  }

  return Object.freeze({
    issueId,
    code: "MISSING_PREVIOUS_EMPLOYMENT_EXIT",
    ruleId: "R001",
    ruleVersion: 1,
    titleKey: "issues.missingPreviousEmploymentExit.title",
    fallbackCopyKey: "issues.missingPreviousEmploymentExit.fallback",
    severity: "ATTENTION",
    defaultOwner: "MEMBER",
    alternativeOwners: Object.freeze(["PREVIOUS_EMPLOYER"] as const),
    fallbackOwner: "REVIEW_REQUIRED",
    affectedWorkflows: Object.freeze(["TRANSFER"] as const),
    allowedActionCodes: ALLOWED_ACTION_CODES,
    requiredEvidence: REQUIRED_EVIDENCE,
    sourceIds: Object.freeze([...check.sourceIds]),
    limitationKey: "issues.missingPreviousEmploymentExit.transferLimitation",
    affectedRecordIds: Object.freeze([...check.affectedRecordIds]),
  });
}
