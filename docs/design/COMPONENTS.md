# PF Health Component Contracts

Components render application state; they do not evaluate PF rules, infer ownership, or mutate repositories directly.

## Application shell

### `AppShell`

Provides the skip link, product identity, independent-prototype label, main landmark, and constrained content width.

### `PrototypeNotice`

Persistent but compact notice: synthetic data, no EPFO connection, no claim submission. Expanded detail may use a disclosure.

## Health components

### `HealthSummary`

Props: overall status, passed/total counts, unknown count, short message, and optional primary action. It must not calculate these values from raw records.

### `HealthCheckList`

Semantic list of `HealthCheckRow` values supplied by the assessment view model.

### `HealthCheckRow`

Displays icon, plain-language label, `PASS | FAIL | UNKNOWN`, and optional explanation/link. Unknown is visually distinct from pass. A row with detail uses a real link or button.

### `IssueCard`

Displays title, concise summary, owner label, severity/status, affected supported workflow, and one CTA. It accepts a fixed issue code for analytics/testing but does not branch on that code to recreate business logic.

### `BeforeAfterSummary`

Shows previous and current assessment counts and names the check that changed. It uses live-region text for revalidation completion and supports reduced motion.

## Issue-detail components

### `IssueHeader`

Contains status, title, and short plain-language summary.

### `ImpactPanel`

Names only workflows present in the structured issue. Includes limitation text; no inferred claim is added in the component.

### `OwnerCard`

Displays default owner, what they may need to do, and fallback owner. Uses neutral language and no blame.

### `ResolutionActionList`

Renders server/application-provided allowed actions. Disabled actions explain why. Selection does not apply a correction.

### `EvidenceDisclosure`

Shows rule ID/version, source title/link, retrieval date, interpretation, and limitation. External links are clearly indicated.

## Resolution components

### `CorrectionRequestEditor`

Editable draft with copy action and generated/deterministic provenance label. It must never display raw model JSON or save automatically.

### `SimulationConfirmation`

Modal or dedicated step that states the exact synthetic fields to change, that nothing is sent externally, and that revalidation follows. Requires an explicit confirmation action.

### `RevalidationProgress`

Shows named phases rather than an indefinite blank spinner: applying synthetic change, rerunning checks, preparing result.

## Timeline components

### `AuditTimeline`

Ordered semantic list. Each event includes display label, actor type, timestamp, and safe metadata summary. Never expose credentials, full identifiers, prompts, or raw documents.

## Shared states

### `LoadingState`

Use content-shaped skeletons sparingly and announce the operation. Do not fake live government activity.

### `ErrorState`

Includes a plain-language error, safe recovery action, and optional reference code. Technical stacks stay out of the UI.

### `EmptyState`

Explains why content is absent and the next action. A missing member or missing assessment is not presented as healthy.

### `UnknownState`

Explains what could not be confirmed and routes to `REVIEW_REQUIRED` guidance where supported.

## Component acceptance rules

- Keyboard and screen-reader semantics are testable.
- No component imports domain rule implementations.
- No status is derived from generated prose.
- Every asynchronous component has loading, failure, and retry behavior.
- Snapshot tests alone are insufficient for interactive behavior.
