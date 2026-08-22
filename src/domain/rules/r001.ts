import { hasNonBlankText, isIsoDate } from "@/domain/model/date";
import type { HealthCheckResult, MemberState } from "@/domain/model/types";

export const R001_SOURCE_IDS = Object.freeze(["SRC-001", "SRC-002"] as const);

function r001Result(
  status: HealthCheckResult["status"],
  reasonCode: string,
  affectedRecordIds: readonly string[],
  evaluatedAt: string,
): HealthCheckResult {
  return Object.freeze({
    checkId: "R001",
    ruleVersion: 1,
    labelKey: "checks.previousEmploymentExitInformation",
    status,
    reasonCode,
    sourceIds: R001_SOURCE_IDS,
    affectedRecordIds: Object.freeze([...affectedRecordIds]),
    evaluatedAt,
  });
}

export function evaluateR001(member: MemberState, evaluatedAt: string): HealthCheckResult {
  if (!Array.isArray(member.employments)) {
    return r001Result("UNKNOWN", "PREVIOUS_EMPLOYMENT_EVIDENCE_UNKNOWN", [], evaluatedAt);
  }

  const previousEmploymentIds: string[] = [];
  const affectedRecordIds: string[] = [];

  for (const employment of member.employments) {
    if (employment.status !== "CURRENT" && employment.status !== "PREVIOUS") {
      return r001Result("UNKNOWN", "EMPLOYMENT_STATUS_AMBIGUOUS", [], evaluatedAt);
    }

    if (
      !hasNonBlankText(employment.employmentId) ||
      !isIsoDate(employment.startDate) ||
      (employment.exitDate !== null && !isIsoDate(employment.exitDate)) ||
      (employment.exitReason !== null && !hasNonBlankText(employment.exitReason))
    ) {
      return r001Result("UNKNOWN", "EMPLOYMENT_EVIDENCE_MALFORMED", [], evaluatedAt);
    }

    if (employment.status === "PREVIOUS") {
      previousEmploymentIds.push(employment.employmentId);

      if (employment.exitDate === null || employment.exitReason === null) {
        affectedRecordIds.push(employment.employmentId);
      }
    }
  }

  if (previousEmploymentIds.length === 0) {
    return r001Result("UNKNOWN", "NO_UNAMBIGUOUS_PREVIOUS_EMPLOYMENT", [], evaluatedAt);
  }

  if (affectedRecordIds.length > 0) {
    return r001Result(
      "FAIL",
      "PREVIOUS_EMPLOYMENT_EXIT_INCOMPLETE",
      affectedRecordIds,
      evaluatedAt,
    );
  }

  return r001Result("PASS", "PREVIOUS_EMPLOYMENT_EXIT_COMPLETE", [], evaluatedAt);
}
