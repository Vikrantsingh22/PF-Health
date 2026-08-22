# PF Health Issue Taxonomy

## Purpose

Issue codes are a closed registry. A rule may emit only a documented code. UI, API, storage, and AI functions consume the same structured issue rather than inventing parallel representations.

## Shared shape

Every issue contains:

- `code`
- `ruleId` and `ruleVersion`
- `titleKey` and deterministic fallback copy key
- `severity`
- `defaultOwner` and `fallbackOwner`
- `affectedWorkflows`
- `resolutionActionCodes`
- `requiredEvidence`
- `sourceIds`
- `limitationKey`
- affected synthetic record references

## Severity

- `ATTENTION`: supported condition needs action or review.
- `BLOCKER`: source-backed blocker for an explicitly named workflow; use sparingly.
- `REVIEW_REQUIRED`: deterministic evidence cannot choose a safe action.

Severity is not inferred from generated text.

## Supported issues

### `MISSING_PREVIOUS_EMPLOYMENT_EXIT`

**Status:** MVP supported
**Rule:** `R001@1`
**Fallback title:** Your previous employment is missing exit information.
**Severity:** `ATTENTION`
**Default owner:** `MEMBER` for reviewing the supported self-service path and prerequisites
**Alternative owner:** `PREVIOUS_EMPLOYER`
**Fallback owner:** `REVIEW_REQUIRED`
**Affected workflows:** `TRANSFER`
**Source IDs:** `SRC-001`, `SRC-002`

**Resolution actions:**

1. `REVIEW_MEMBER_MARK_EXIT_PATH` — review whether the source-stated prerequisites apply.
2. `DRAFT_PREVIOUS_EMPLOYER_REQUEST` — prepare a neutral request for review/update.
3. `REQUEST_EPFO_REVIEW` — show official help/grievance guidance without submitting anything.
4. `SIMULATE_EXIT_UPDATE` — local demo-only mutation after explicit confirmation.

**Required evidence:** unambiguous previous employment plus missing exit date or reason in the normalized synthetic record.

**Limitation:** The prototype does not determine real-world eligibility for a correction path and does not claim impact outside the supported online-transfer scenario.

## Reserved issues — not supported

These codes reserve vocabulary for possible future research. They must not be emitted, displayed as actual findings, or included in the health score:

- `KYC_IDENTITY_MISMATCH`
- `BANK_VERIFICATION_INCOMPLETE`
- `UNKNOWN_RECORD_CONDITION`

Unknown evidence should normally be represented by a `HealthCheckResult` with status `UNKNOWN`, not a fabricated issue. `UNKNOWN_RECORD_CONDITION` requires a specific future product use case before activation.

## Registration checklist

No new code is valid until it has:

- explicit product approval;
- a deterministic rule with `PASS`, `FAIL`, and `UNKNOWN` behavior;
- official evidence and limitations;
- owner and fallback owner;
- allowed resolution actions;
- deterministic fallback copy;
- unit and contract tests;
- API and data-model compatibility review.
