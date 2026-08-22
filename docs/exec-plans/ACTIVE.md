# Active Execution Plan

## Milestone 0 — Codex harness and source-of-truth documentation

**Status:** COMPLETE

### Goal

Create a coherent repository operating environment before application code.

### Completed

- [x] Agent constitution and repository entry point
- [x] Product requirements, scope, journey, and demo runbook
- [x] Architecture and logical data/API contracts
- [x] Design direction, system, components, and copy doctrine
- [x] Domain vocabulary, R001, issue taxonomy, and official sources
- [x] AI authority boundaries, security policy, and test strategy
- [x] Future semantic-router boundary
- [x] Persistent cross-chat handoff in `project_state.md`

### Verification

Documentation completeness and consistency checks. No code checks exist yet.

## Milestone 1 — Project bootstrap and deterministic domain

**Status:** NEXT

### Goal

Create a runnable TypeScript application/test harness and implement the complete deterministic hero case without OpenAI or frontend polish.

### Task sequence

- [ ] Initialize pinned Next.js/TypeScript project with strict settings
- [ ] Add lint, typecheck, unit-test, build, and aggregate check scripts
- [ ] Add `.env.example`, safe `.gitignore`, and setup notes
- [ ] Implement boundary schemas and domain types
- [ ] Add immutable Ravi before/after fixtures
- [ ] Implement record normalizer
- [ ] Implement D001–D004 demo-integrity checks
- [ ] Implement R001 as a pure rule
- [ ] Implement issue registry and health engine
- [ ] Add unit tests for pass/fail/unknown and golden assessments

### Exit criterion

Given `raviBeforeCorrection`, the engine returns exactly five checks, four passes, one R001 failure, one `MISSING_PREVIOUS_EMPLOYMENT_EXIT` issue, and `NEEDS_ATTENTION`.

Given `raviAfterCorrection`, the engine returns five passes, zero issues, and `HEALTHY`.

No OpenAI call, UI, database, or network is required. Lint, typecheck, unit tests, and build pass from a clean install.

## Milestone 2 — Deterministic resolution journey

**Status:** PENDING

- [ ] Implement repository ports and local synthetic adapter
- [ ] Implement resolution action validation and lifecycle
- [ ] Implement explicit simulated correction with version check
- [ ] Append safe audit events
- [ ] Revalidate automatically after mutation
- [ ] Add application and conflict/replay tests
- [ ] Add deterministic reset/seed commands

**Exit criterion:** reset → assess → apply allowed synthetic correction → revalidate → healthy is reproducible through application services.

## Milestone 3 — Minimal UI and E2E

**Status:** PENDING

- [ ] Welcome, loading, summary, issue, resolution, confirmation, revalidation, healthy, and timeline screens
- [ ] Deterministic fallback copy and source disclosure
- [ ] Loading/error/empty/unknown states
- [ ] Mobile accessibility and keyboard behavior
- [ ] Hero-flow Playwright test

**Exit criterion:** the complete demo path works at 375px without network access and passes E2E.

## Milestone 4 — Optional bounded AI

**Status:** PENDING; requires explicit approval after Milestone 3

- [ ] Implement validated issue-explanation gateway
- [ ] Implement validated correction-draft gateway
- [ ] Add timeout, invalid-output, injection, and fallback tests
- [ ] Prove that AI cannot alter status, owner, action, or state

## Milestone 5 — Submission hardening

**Status:** PENDING

- [ ] Review 375px, 768px, and 1440px layouts
- [ ] Run security, privacy, domain, UX, and demo-fragility reviews
- [ ] Fix confirmed high-value findings only
- [ ] Verify clean-clone setup and offline deterministic demo
- [ ] Complete Codex log and final runbook
- [ ] Archive this plan under `completed/` and create the next plan

## Guardrails for every milestone

- Prefer one focused engineering mission per change.
- Inspect and plan before non-trivial implementation.
- Define acceptance criteria and “do not touch” boundaries.
- Commit coherent missions separately.
- Do not introduce new PF rules or scope without approval.
- Update affected documentation and `CODEX_LOG.md`.
