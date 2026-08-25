# PF Health Rules

## Rule policy

- Rules are deterministic, pure, versioned, and independently testable.
- A new PF rule requires an approved issue-taxonomy entry and official evidence in `SOURCES.md`.
- Missing required evidence returns `UNKNOWN`; it is never guessed.
- Rules emit structured facts, not generated prose.
- UI code and prompts may not reimplement conditions.
- Rule results include `ruleId`, `ruleVersion`, `sourceIds`, `status`, `reasonCode`, and safe evidence references.

## MVP check set

The demo displays five checks. Four are synthetic-record integrity checks and do not make government eligibility claims. R001 is the only PF workflow rule authorized for the MVP.

| ID | Label | Type | Hero before | Hero after |
| --- | --- | --- | --- | --- |
| D001 | Sample record format | Demo integrity | PASS | PASS |
| D002 | Member profile present | Demo integrity | PASS | PASS |
| D003 | Current employment present | Demo integrity | PASS | PASS |
| D004 | Previous employment start information | Demo integrity | PASS | PASS |
| R001 | Previous employment exit information | PF workflow rule | FAIL | PASS |

Demo-integrity checks validate only the fixture and app assumptions. They must be labeled as supported record checks, not as legal eligibility requirements, and they never produce PF issues.

## D001 — Sample record format

**Status:** supported for demo integrity
**Condition:** The normalized fixture matches the versioned `MemberState` schema.
**PASS:** Schema validation succeeds.
**UNKNOWN:** The payload is absent or invalid.
**FAIL:** Not used; malformed input is unknown/review-required rather than a PF issue.
**Sources:** none; application integrity check.

## D002 — Member profile present

**Status:** supported for demo integrity
**Inputs:** synthetic member ID and display name.
**PASS:** Both are present after normalization.
**UNKNOWN:** Either is unavailable.
**FAIL:** Not used.
**Sources:** none; application integrity check.

## D003 — Current employment present

**Status:** supported for demo integrity
**Inputs:** normalized employment records.
**PASS:** Exactly one record is marked `CURRENT`.
**UNKNOWN:** Zero or more than one current record exists.
**FAIL:** Not used.
**Sources:** none; fixture invariant, not an EPFO requirement.

## D004 — Previous employment start information

**Status:** supported for demo integrity
**Inputs:** previous employment start date.
**PASS:** Every previous record in the hero fixture has a valid start date.
**UNKNOWN:** Any required start date is absent or invalid.
**FAIL:** Not used.
**Sources:** none; fixture completeness check.

## R001 — Missing previous-employment exit information

**Status:** supported
**Version:** 1
**Issue code:** `MISSING_PREVIOUS_EMPLOYMENT_EXIT`
**Supported context:** `TRANSFER` and general-health presentation with transfer-specific limitation

### Inputs

- `employment.status`
- `employment.startDate`
- `employment.exitDate`
- `employment.exitReason`
- evidence that the record is a previous employment

### Condition

For each unambiguously previous employment record, exit information is incomplete when either the exit date or exit reason required by the supported synthetic scenario is absent.

### Result

- `FAIL`: at least one previous record has incomplete exit information.
- `PASS`: at least one previous record exists and every previous record has complete exit information.
- `UNKNOWN`: previous/current status is ambiguous, required fields are malformed, or the snapshot cannot support the distinction.

### Produces

`MISSING_PREVIOUS_EMPLOYMENT_EXIT`, one issue containing the affected synthetic employment record IDs. Multiple affected records do not create duplicate issue cards in the MVP.

### Severity

`ATTENTION` for general health. Do not use `BLOCKER` unless the assessment is explicitly for the supported online-transfer scenario and product copy is updated to retain the source limitation.

The hero case remains `NEEDS_ATTENTION` to avoid overstating real-world outcomes.

### Possible impact

`TRANSFER` only. No claim, pension, settlement, or tax impact is asserted by R001.

### Resolution routing

Default demo path: `MEMBER` reviews the published mark-exit path and its prerequisites. Alternative: request the previous employer's help. Fallback: `REVIEW_REQUIRED`/EPFO guidance when prerequisites, facts, or portal behavior are not supported by the prototype.

### Sources

- `SRC-001`
- `SRC-002`

### Limitations

The evidence supports the date-of-exit requirement for the named online-transfer scenario and describes a self-service path with prerequisites. R001 does not claim that every missing exit field blocks every PF transaction, that a member is eligible to use the path, or that a correction will be accepted.

## Candidate rules — not implemented

`KYC_IDENTITY_MISMATCH` and `BANK_VERIFICATION_INCOMPLETE` remain research candidates only. Their source entries may inform future scoping, but no check, issue, score, UI status, or action may be implemented without explicit approval and complete rule specifications.

## Rule change checklist

1. Update evidence and retrieval date if necessary.
2. Define inputs, pass/fail/unknown behavior, context, impact, owner, and limitation.
3. Add or update issue taxonomy.
4. Increment rule version for behavior changes.
5. Add pass, fail, unknown, boundary, and regression tests.
6. Update API examples and demo oracle if observable behavior changes.
# PF_LAB@1

- `R001@1`: incomplete exit date/reason on a previous employment emits attention.
- `R002@1`: a previous exit later than the current start emits review-required; boundary equality passes and no date is chosen automatically.
- `R003@1`: multiple synthetic account groups block only the selected online-transfer workflow; general health remains non-blocking.
- Outcome precedence is `BLOCKED → NEEDS_ATTENTION → REVIEW_REQUIRED → HEALTHY`.

The Ravi tutorial remains frozen on its original five-check ruleset and contracts.
