export type EmploymentStatus = "CURRENT" | "PREVIOUS";
export type WorkflowType = "GENERAL_HEALTH" | "TRANSFER";
export type CheckStatus = "PASS" | "FAIL" | "UNKNOWN";
export type AssessmentStatus =
  | "HEALTHY"
  | "NEEDS_ATTENTION"
  | "BLOCKED"
  | "REVIEW_REQUIRED";
export type Severity = "ATTENTION" | "BLOCKER" | "REVIEW_REQUIRED";
export type Owner =
  | "MEMBER"
  | "CURRENT_EMPLOYER"
  | "PREVIOUS_EMPLOYER"
  | "EPFO"
  | "REVIEW_REQUIRED";

export type CheckId = "D001" | "D002" | "D003" | "D004" | "R001";
export type IssueCode = "MISSING_PREVIOUS_EMPLOYMENT_EXIT";
export type ResolutionActionCode =
  | "REVIEW_MEMBER_MARK_EXIT_PATH"
  | "DRAFT_PREVIOUS_EMPLOYER_REQUEST"
  | "REQUEST_EPFO_REVIEW"
  | "SIMULATE_EXIT_UPDATE";
export type ResolutionStatus =
  | "OPEN"
  | "ACTION_SELECTED"
  | "SIMULATION_CONFIRMED"
  | "APPLIED"
  | "REVALIDATED";
export type AuditEventType =
  | "DEMO_RESET"
  | "MEMBER_LOADED"
  | "ASSESSMENT_COMPLETED"
  | "ISSUE_VIEWED"
  | "RESOLUTION_OPENED"
  | "ACTION_SELECTED"
  | "SIMULATION_CONFIRMED"
  | "SYNTHETIC_CORRECTION_APPLIED"
  | "REVALIDATION_COMPLETED";

export interface EmploymentRecord {
  readonly employmentId: string;
  readonly employerLabel: string;
  readonly status: EmploymentStatus;
  readonly startDate: string;
  readonly exitDate: string | null;
  readonly exitReason: string | null;
}

export interface MemberState {
  readonly memberId: string;
  readonly displayName: string;
  readonly snapshotVersion: number;
  readonly schemaVersion: 1;
  readonly employments: readonly EmploymentRecord[];
}

export interface HealthCheckResult {
  readonly checkId: CheckId;
  readonly ruleVersion: number;
  readonly labelKey: string;
  readonly status: CheckStatus;
  readonly reasonCode: string;
  readonly sourceIds: readonly string[];
  readonly affectedRecordIds: readonly string[];
  readonly evaluatedAt: string;
}

export interface Issue {
  readonly issueId: string;
  readonly code: IssueCode;
  readonly ruleId: "R001";
  readonly ruleVersion: 1;
  readonly titleKey: string;
  readonly fallbackCopyKey: string;
  readonly severity: Severity;
  readonly defaultOwner: Owner;
  readonly alternativeOwners: readonly Owner[];
  readonly fallbackOwner: Owner;
  readonly affectedWorkflows: readonly WorkflowType[];
  readonly allowedActionCodes: readonly ResolutionActionCode[];
  readonly requiredEvidence: readonly string[];
  readonly sourceIds: readonly string[];
  readonly limitationKey: string;
  readonly affectedRecordIds: readonly string[];
}

export interface HealthAssessment {
  readonly assessmentId: string;
  readonly memberId: string;
  readonly memberSnapshotVersion: number;
  readonly ruleSetVersion: 1;
  readonly workflow: Readonly<{ type: WorkflowType }>;
  readonly status: AssessmentStatus;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly unknownChecks: number;
  readonly totalChecks: number;
  readonly checks: readonly HealthCheckResult[];
  readonly issues: readonly Issue[];
  readonly evaluatedAt: string;
}

export interface ResolutionCase {
  readonly resolutionId: string;
  readonly memberId: string;
  readonly issueId: string;
  readonly status: ResolutionStatus;
  readonly selectedAction: ResolutionActionCode | null;
  readonly expectedSnapshotVersion: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SimulateExitUpdateCommand {
  readonly memberId: string;
  readonly resolutionId: string;
  readonly employmentId: string;
  readonly expectedSnapshotVersion: number;
  readonly exitDate: string;
  readonly exitReason: string;
  readonly confirmationToken: string;
}

export interface AuditEvent {
  readonly eventId: string;
  readonly memberId: string;
  readonly resolutionId?: string;
  readonly type: AuditEventType;
  readonly actor: "MEMBER" | "SYSTEM";
  readonly occurredAt: string;
  readonly fromSnapshotVersion?: number;
  readonly toSnapshotVersion?: number;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
}
