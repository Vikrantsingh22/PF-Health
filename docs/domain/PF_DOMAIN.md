# PF Health Domain Model

This vocabulary describes PF Health's synthetic prototype model. It is not a complete representation of EPFO law, policy, or systems.

## Core entities

### Member

The synthetic PF account owner. A member has an internal demo ID, display name, profile facts, employment records, and snapshot version. Never use a real UAN as the primary key.

### MemberState

An immutable normalized snapshot evaluated by the health engine. It contains only fields required by supported checks. Raw adapter payloads are not passed directly to rules.

### EmploymentRecord

One synthetic employment relationship in the member's PF history. It includes an internal record ID, synthetic employer label, start date, optional exit date/reason, and `CURRENT | PREVIOUS` status.

### WorkflowContext

The member goal against which a check is interpreted.

Supported MVP values:

- `GENERAL_HEALTH`
- `TRANSFER`

A general result must not be silently converted into a claim-specific eligibility result.

### HealthRule

A pure, versioned deterministic function that evaluates one documented condition. It declares required inputs, issue code if applicable, source IDs, and supported workflow contexts.

### HealthCheckResult

The result of one rule or explicitly documented demo-integrity check:

- `PASS`: required evidence exists and the supported condition is not present.
- `FAIL`: required evidence exists and a supported actionable condition is present.
- `UNKNOWN`: evidence is missing, malformed, contradictory, or outside the rule's supported interpretation.

`UNKNOWN` is not a pass.

### Issue

A structured actionable problem produced only from a failing supported rule. It references an issue code, rule ID/version, severity, owners, workflows, actions, sources, and limitation. UI copy and AI output do not create issues.

### HealthAssessment

An immutable aggregate containing the member snapshot version, workflow context, check results, issues, counts, overall status, rule-set version, and evaluation time.

Overall status:

- `HEALTHY`: all supported checks pass.
- `NEEDS_ATTENTION`: at least one supported issue exists and none requires blocker precedence.
- `BLOCKED`: a rule explicitly backed for the named workflow produces blocker severity.
- `REVIEW_REQUIRED`: no issue is known to block, but at least one material check is unknown or unsupported.

The MVP hero case uses `NEEDS_ATTENTION`, not `BLOCKED`.

## Resolution concepts

### Owner

The actor responsible for the next supported step, not necessarily the cause of the condition.

- `MEMBER`
- `CURRENT_EMPLOYER`
- `PREVIOUS_EMPLOYER`
- `EPFO`
- `REVIEW_REQUIRED`

### ResolutionAction

A predefined action allowed for an issue under stated prerequisites. It includes an action code, owner, description, required evidence, whether it is simulated, and the state transition it permits.

MVP action codes:

- `REVIEW_MEMBER_MARK_EXIT_PATH`
- `DRAFT_PREVIOUS_EMPLOYER_REQUEST`
- `REQUEST_EPFO_REVIEW`
- `SIMULATE_EXIT_UPDATE`

Only `SIMULATE_EXIT_UPDATE` mutates data, and only synthetic local state after confirmation.

### ResolutionCase

Tracks the selected action and lifecycle:

`OPEN → ACTION_SELECTED → SIMULATION_CONFIRMED → APPLIED → REVALIDATED`

Cancellation is allowed before `APPLIED`. A failed or stale mutation does not advance state.

### AuditEvent

An append-only record of a user command or system result. It records safe IDs, actor type, event type, timestamp, snapshot versions, and safe metadata—not raw documents, prompts, secrets, or full government identifiers.

## Evidence and provenance

### SourceReference

Points to an entry in `SOURCES.md`. Each rule carries one or more source IDs and an explicit limitation.

### Rule version

An integer incremented when evaluation behavior changes. Copy-only changes do not alter deterministic rule versions.

## Invariants

- Current employment must not have an exit date in the supported fixture.
- A previous employment may have missing exit information; that absence is not auto-filled during normalization.
- Exit date and exit reason are treated together by R001 for the supported scenario.
- An issue always points to the check that created it.
- A resolved label alone never removes an issue; only re-evaluation of updated facts can do so.
- Assessment and mutation use snapshot versions to prevent stale changes.
- Generated text is never stored as authoritative domain state.

## Terms deliberately not modeled in MVP

Actual UAN/MID formats, balances, contributions, claim forms, service calculations, EPS eligibility, tax treatment, nomination, production identity/KYC verification, and legal adjudication.
