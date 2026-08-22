import { memberStateSchema } from "@/application/normalization/member-state";
import { hasNonBlankText, isIsoDate } from "@/domain/model/date";
import type { HealthCheckResult, MemberState } from "@/domain/model/types";

function demoCheckResult(
  checkId: "D001" | "D002" | "D003" | "D004",
  labelKey: string,
  status: "PASS" | "UNKNOWN",
  reasonCode: string,
  affectedRecordIds: readonly string[],
  evaluatedAt: string,
): HealthCheckResult {
  return Object.freeze({
    checkId,
    ruleVersion: 1,
    labelKey,
    status,
    reasonCode,
    sourceIds: Object.freeze([]),
    affectedRecordIds: Object.freeze([...affectedRecordIds]),
    evaluatedAt,
  });
}

export function evaluateD001(member: unknown, evaluatedAt: string): HealthCheckResult {
  const valid = memberStateSchema.safeParse(member).success;
  return demoCheckResult(
    "D001",
    "checks.sampleRecordFormat",
    valid ? "PASS" : "UNKNOWN",
    valid ? "SAMPLE_RECORD_FORMAT_VALID" : "SAMPLE_RECORD_FORMAT_INVALID",
    [],
    evaluatedAt,
  );
}

export function evaluateD002(member: MemberState, evaluatedAt: string): HealthCheckResult {
  const valid = hasNonBlankText(member.memberId) && hasNonBlankText(member.displayName);
  return demoCheckResult(
    "D002",
    "checks.memberProfilePresent",
    valid ? "PASS" : "UNKNOWN",
    valid ? "MEMBER_PROFILE_PRESENT" : "MEMBER_PROFILE_MISSING",
    [],
    evaluatedAt,
  );
}

export function evaluateD003(member: MemberState, evaluatedAt: string): HealthCheckResult {
  const currentRecords = member.employments.filter(({ status }) => status === "CURRENT");
  const valid = currentRecords.length === 1;
  return demoCheckResult(
    "D003",
    "checks.currentEmploymentPresent",
    valid ? "PASS" : "UNKNOWN",
    valid ? "EXACTLY_ONE_CURRENT_EMPLOYMENT" : "CURRENT_EMPLOYMENT_COUNT_INVALID",
    valid ? [] : currentRecords.map(({ employmentId }) => employmentId),
    evaluatedAt,
  );
}

export function evaluateD004(member: MemberState, evaluatedAt: string): HealthCheckResult {
  const invalidPreviousRecords = member.employments.filter(
    ({ status, startDate }) => status === "PREVIOUS" && !isIsoDate(startDate),
  );
  const valid = invalidPreviousRecords.length === 0;
  return demoCheckResult(
    "D004",
    "checks.previousEmploymentStartInformation",
    valid ? "PASS" : "UNKNOWN",
    valid ? "PREVIOUS_EMPLOYMENT_STARTS_VALID" : "PREVIOUS_EMPLOYMENT_START_INVALID",
    invalidPreviousRecords.map(({ employmentId }) => employmentId),
    evaluatedAt,
  );
}
