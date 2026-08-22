# PF Health Data Model

This is the logical TypeScript model. Persistence representation may differ behind repositories, but public domain values and invariants remain stable. All IDs are opaque internal strings; examples are synthetic.

## Enums

```ts
type EmploymentStatus = "CURRENT" | "PREVIOUS";
type WorkflowType = "GENERAL_HEALTH" | "TRANSFER";
type CheckStatus = "PASS" | "FAIL" | "UNKNOWN";
type AssessmentStatus =
  | "HEALTHY"
  | "NEEDS_ATTENTION"
  | "BLOCKED"
  | "REVIEW_REQUIRED";
type Severity = "ATTENTION" | "BLOCKER" | "REVIEW_REQUIRED";
type Owner =
  | "MEMBER"
  | "CURRENT_EMPLOYER"
  | "PREVIOUS_EMPLOYER"
  | "EPFO"
  | "REVIEW_REQUIRED";
```

## Member snapshot

```ts
interface MemberState {
  memberId: string;
  displayName: string;
  snapshotVersion: number;
  schemaVersion: 1;
  employments: EmploymentRecord[];
}

interface EmploymentRecord {
  employmentId: string;
  employerLabel: string;
  status: EmploymentStatus;
  startDate: string;       // ISO date, validated
  exitDate: string | null;
  exitReason: string | null;
}
```

Do not add real UAN, Aadhaar, PAN, bank, or employer identifiers to the MVP model. If a UI needs a reference, use a clearly synthetic masked label.

## Rule result

```ts
interface HealthCheckResult {
  checkId: "D001" | "D002" | "D003" | "D004" | "R001";
  ruleVersion: number;
  labelKey: string;
  status: CheckStatus;
  reasonCode: string;
  sourceIds: string[];
  affectedRecordIds: string[];
  evaluatedAt: string;
}
```

Demo-integrity checks have a version and empty `sourceIds`; R001 has official provenance.

## Issue and actions

```ts
type IssueCode = "MISSING_PREVIOUS_EMPLOYMENT_EXIT";

interface Issue {
  issueId: string;
  code: IssueCode;
  ruleId: "R001";
  ruleVersion: 1;
  titleKey: string;
  fallbackCopyKey: string;
  severity: Severity;
  defaultOwner: Owner;
  alternativeOwners: Owner[];
  fallbackOwner: Owner;
  affectedWorkflows: WorkflowType[];
  allowedActionCodes: ResolutionActionCode[];
  requiredEvidence: string[];
  sourceIds: string[];
  limitationKey: string;
  affectedRecordIds: string[];
}

type ResolutionActionCode =
  | "REVIEW_MEMBER_MARK_EXIT_PATH"
  | "DRAFT_PREVIOUS_EMPLOYER_REQUEST"
  | "REQUEST_EPFO_REVIEW"
  | "SIMULATE_EXIT_UPDATE";
```

## Assessment

```ts
interface HealthAssessment {
  assessmentId: string;
  memberId: string;
  memberSnapshotVersion: number;
  ruleSetVersion: 1;
  workflow: { type: WorkflowType };
  status: AssessmentStatus;
  passedChecks: number;
  failedChecks: number;
  unknownChecks: number;
  totalChecks: number;
  checks: HealthCheckResult[];
  issues: Issue[];
  evaluatedAt: string;
}
```

Aggregate invariants:

- Counts equal the check array.
- `HEALTHY` requires all checks `PASS`.
- `NEEDS_ATTENTION` requires at least one issue.
- `REVIEW_REQUIRED` requires at least one material `UNKNOWN` and no higher-precedence known issue.
- Issues correspond one-to-one with supported failing issue codes, not necessarily failing record count.
- The assessment snapshot version equals the evaluated member snapshot.

## Resolution and mutation

```ts
type ResolutionStatus =
  | "OPEN"
  | "ACTION_SELECTED"
  | "SIMULATION_CONFIRMED"
  | "APPLIED"
  | "REVALIDATED";

interface ResolutionCase {
  resolutionId: string;
  memberId: string;
  issueId: string;
  status: ResolutionStatus;
  selectedAction: ResolutionActionCode | null;
  expectedSnapshotVersion: number;
  createdAt: string;
  updatedAt: string;
}

interface SimulateExitUpdateCommand {
  memberId: string;
  resolutionId: string;
  employmentId: string;
  expectedSnapshotVersion: number;
  exitDate: string;
  exitReason: string;
  confirmationToken: string;
}
```

The application validates that the employment is affected by the issue and that `SIMULATE_EXIT_UPDATE` is allowed. Successful mutation increments `snapshotVersion` exactly once.

## Audit event

```ts
type AuditEventType =
  | "DEMO_RESET"
  | "MEMBER_LOADED"
  | "ASSESSMENT_COMPLETED"
  | "ISSUE_VIEWED"
  | "RESOLUTION_OPENED"
  | "ACTION_SELECTED"
  | "SIMULATION_CONFIRMED"
  | "SYNTHETIC_CORRECTION_APPLIED"
  | "REVALIDATION_COMPLETED";

interface AuditEvent {
  eventId: string;
  memberId: string;
  resolutionId?: string;
  type: AuditEventType;
  actor: "MEMBER" | "SYSTEM";
  occurredAt: string;
  fromSnapshotVersion?: number;
  toSnapshotVersion?: number;
  metadata: Record<string, string | number | boolean>;
}
```

Use an allowlist per event type for metadata. Do not store request headers, model prompts, raw documents, or sensitive identifiers.

## AI values

AI explanation/draft values live outside authoritative aggregates and include the related issue ID, prompt/schema version, generated time, and validated text. They cannot contain status, owner, rule result, or mutation commands.

## Fixture oracle

`raviBeforeCorrection` has snapshot version 1 and R001-failing null exit fields. `raviAfterCorrection` has snapshot version 2 and complete synthetic exit fields. Expected assessments are defined in `docs/product/DEMO.md` and must be asserted in tests.
