# PF Health Working Roughpad

Last updated: 2026-08-23

## Purpose

This is the working task pad for implementation. Use it to break the active mission into small actions, record immediate notes, and mark work complete.

This file is not a product or architecture authority. If it conflicts with `AGENTS.md`, `project_state.md`, `docs/product/SCOPE.md`, or another dedicated specification, stop and follow the authoritative document.

## Status legend

- `[ ]` not started
- `[-]` in progress
- `[x]` complete and verified
- `[!]` blocked or requires a human decision

## Working rules

- Keep only one implementation mission in progress at a time.
- Mark an item complete only after its named verification passes.
- Record exact commands and outcomes; never replace evidence with “works.”
- Update `project_state.md` when phase, verification, risks, decisions, or next work changes.
- Add a factual `CODEX_LOG.md` entry after every meaningful mission.
- Inspect the final diff, run all relevant checks, and commit each coherent verified mission with a focused message.
- Record the commit hash in the completion report and continuity files when it changes the handoff state.
- Never commit known-broken work or bundle unrelated user changes.
- Never touch project files or resources outside `pf-health`.
- Run all dependency installation, application execution, tests, checks, builds, and local state inside the PF Health Docker sandbox.
- Scope Docker commands and cleanup to the PF Health Compose project; never change unrelated Docker services or resources.
- Do not activate deferred rules, AI, real integrations, or extra personas without explicit approval.
- Preserve unrelated user changes and inspect Git status before every mission.

## Planning baseline

- [x] Read `AGENTS.md` and the persistent project state.
- [x] Review the repository-aligned hackathon plan.
- [x] Reconcile the plan with product scope, architecture, data model, rules, taxonomy, and testing strategy.
- [x] Convert the plan into ordered implementation missions below.
- [x] Record the start of implementation planning in `project_state.md` and `CODEX_LOG.md`.
- [x] Adopt verify-before-commit as the repository workflow.

## Mission 1 — Bootstrap the application harness

**Status:** COMPLETE

**Goal:** Create a Docker-isolated, runnable, pinned Next.js/TypeScript harness without implementing product features or executing project tooling on the host.

### Actions

- [x] Verify Docker/Compose availability without changing unrelated services (`Docker 29.5.3`; Compose `v5.1.4`).
- [x] Add a minimal multi-stage `Dockerfile`, `compose.yaml`, and `.dockerignore`.
- [x] Configure a non-root application user, dedicated project network, named dependency/runtime volumes, and `127.0.0.1`-only port binding.
- [x] Verify no mount resolves outside `pf-health`; prohibit privileged mode, host namespaces, devices, added capabilities, and Docker socket access.
- [x] Inspect container-available Node/package-manager versions and choose pinned framework/tool versions.
- [x] Initialize Next.js with the App Router, `src/`, strict TypeScript, Tailwind CSS, and ESLint inside the container without overwriting repository documentation.
- [x] Add the package manifest and lockfile.
- [x] Configure strict TypeScript with no `any` escape hatch.
- [x] Configure unit testing for pure TypeScript modules.
- [x] Add `lint`, `typecheck`, `test`, `build`, and aggregate `check` scripts.
- [x] Add a safe `.gitignore` for dependencies, generated output, local state, secrets, logs, and editor files.
- [x] Add `.env.example` with no secrets; the current harness requires no environment variables.
- [x] Add minimal setup and command notes to `README.md`.
- [x] Run a clean image build, containerized dependency install, and all available checks.
- [x] Review the diff for accidental feature code, sensitive values, or documentation loss.
- [x] Update `project_state.md`, `CODEX_LOG.md`, and this roughpad with exact results.

### Exit criteria

- [x] `docker compose config` resolves and passes the isolation review.
- [x] A clean Docker image build and containerized install succeed from the repository root.
- [x] Containerized `npm run lint` passes with no warnings.
- [x] Containerized `npm run typecheck` passes.
- [x] Containerized `npm run test` passes with one minimal harness test.
- [x] Containerized `npm run build` passes.
- [x] Containerized `npm run check` runs the required aggregate checks and passes.
- [x] No host `node_modules`, package-manager cache, application process, test runner, or build output is created.
- [x] No UI feature, PF rule, persistence, network adapter, or OpenAI integration has been added.

## Mission 2 — Deterministic domain foundation

**Status:** COMPLETE

**Goal:** Implement the full pure-domain oracle for Ravi before and after correction.

### Actions

- [x] Create framework-independent domain, schema, fixture, rule, and test modules.
- [x] Implement Zod boundary schemas matching `docs/engineering/DATA_MODEL.md`.
- [x] Implement explicit domain types and inject clock/ID providers where needed.
- [x] Add immutable `raviBeforeCorrection` and `raviAfterCorrection` fixtures.
- [x] Implement a normalizer that rejects unsupported fields and never invents exit data.
- [x] Implement D001-D004 as demo-integrity checks with `PASS`/`UNKNOWN` behavior.
- [x] Implement pure, versioned R001 with `PASS`/`FAIL`/`UNKNOWN` behavior and source provenance.
- [x] Implement the closed `MISSING_PREVIOUS_EMPLOYMENT_EXIT` issue registry entry.
- [x] Implement the health engine, stable check order, counts, status precedence, and issue aggregation.
- [x] Add the complete rule matrix and golden before/after assessment tests from `TESTING.md`.
- [x] Run all checks and record exact test evidence: 19 tests across four files passed in Docker.

### Exit criteria

- [x] Before fixture: exactly five checks, four pass, one R001 fail, zero unknown, one expected issue, and `NEEDS_ATTENTION`.
- [x] After fixture: exactly five passes, zero issues, and `HEALTHY`.
- [x] Unsupported or ambiguous evidence remains `UNKNOWN`/`REVIEW_REQUIRED`.
- [x] Domain code imports no React, Next.js, database, network, or OpenAI implementation.
- [x] Clean install, lint, typecheck, tests, and build pass.

## Mission 3 — Deterministic resolution application

**Status:** COMPLETE

**Goal:** Make reset → assess → confirm correction → mutate synthetic state → revalidate reproducible through application services.

### Actions

- [x] Define repository and adapter ports.
- [x] Implement the Ravi-only `MockEPFOAdapter` with no government network calls.
- [x] Implement local replaceable persistence only as needed for the demo lifecycle.
- [x] Implement resolution creation, allowed-action validation, and action selection.
- [x] Require explicit confirmation, expected snapshot version, and single-use protection.
- [x] Apply only the allowed synthetic exit update and increment the snapshot version once.
- [x] Append allowlisted audit events for each state transition.
- [x] Re-run the same health engine automatically after mutation.
- [x] Add deterministic `seed:demo` and `reset:demo` scripts.
- [x] Test stale versions, replay, invalid dates, wrong records, unsupported actions, and successful revalidation.

### Exit criteria

- [x] The complete deterministic application journey is reproducible without UI, network, database service, or AI.
- [x] Every mutation has confirmation, concurrency protection, and append-only audit evidence.
- [x] Reset restores the exact initial state after complete and partial journeys.
- [x] All required checks pass: 29 tests across five files passed in Docker.

## Mission 4 — Minimal mobile-first UI and E2E

**Status:** COMPLETE

**Goal:** Expose the deterministic hero journey as one accessible, reliable demo flow.

### Actions

- [x] Confirm the Impeccable comp-first build path and durable product constraints.
- [x] Create root product and visual-world context for Impeccable from the approved PF Health documentation.
- [x] Generate and present three grounded mobile composition directions before implementing UI code.
- [x] Record the selected Calm Case File direction, refined approved comp, provenance, and surface brief.
- [x] Implement strict `/api/v1` request/response schemas, stable error envelopes, no-store state routes, and the complete deterministic resolution boundary.
- [x] Implement the six grouped screen states defined in the plan and design documents.
- [x] Add synthetic-data and non-affiliation disclosure before loading Ravi.
- [x] Render welcome, loading, summary, issue, resolution, confirmation, revalidation, healthy, timeline, and reset states.
- [x] Keep one primary action per screen and show impact, owner, evidence, limitation, and next step.
- [x] Provide deterministic explanation and correction-request fallback copy.
- [x] Keep `UNKNOWN` and `REVIEW_REQUIRED` visibly distinct from healthy and needs-attention.
- [x] Add loading, recoverable error/retry, conflict, and stale-state behavior; the fixed five-check fixture has no separate data-empty state.
- [x] Verify semantic HTML, keyboard flow, focus behavior, touch targets, and status text independent of color.
- [x] Add Playwright coverage for the complete mobile hero journey and reset.
- [x] Run `/impeccable audit` on the functionally complete hero path and resolve measurable accessibility, responsive, performance, and interaction defects.
- [x] Run `/impeccable polish` only after audit and E2E pass; refine alignment, typography, token usage, state coverage, motion, copy, and cleanup without redesigning the approved Case File direction.

### Exit criteria

- [x] The journey passes at a 375px viewport without network or AI.
- [x] A user can complete the hero flow without developer guidance.
- [x] E2E proves 4/5 → correction → automatic revalidation → 5/5 → reset.
- [x] Impeccable audit precedes the final polish pass, and polish leaves no known broken, unfinished, or placeholder state.
- [x] Lint, typecheck, 32 unit/integration tests, build, and two E2E tests pass.

## Mission 5 — Optional bounded AI

**Status:** REQUIRES EXPLICIT HUMAN APPROVAL AFTER MISSION 4

**Goal:** Add explanation or drafting enhancement without changing deterministic authority.

### Actions

- [ ] Confirm explicit approval and select the smallest approved AI use case.
- [ ] Send only minimal structured synthetic facts through an isolated gateway.
- [ ] Validate structured output and reject extra or authority-bearing fields.
- [ ] Add timeout, refusal, malformed-output, injection, and provider-failure tests.
- [ ] Prove deterministic fallback remains available and health/resolution state cannot change.

### Exit criteria

- [ ] AI can be disabled or fail without blocking the demo.
- [ ] AI cannot alter status, severity, owner, allowed actions, source provenance, or member state.

## Mission 6 — Submission hardening

**Status:** BLOCKED BY REQUIRED MVP MISSIONS

**Goal:** Freeze a credible, resettable submission and prepare the public demo package.

### Actions

- [ ] Verify layouts at 375px, 768px, and 1440px.
- [ ] Run security, privacy, source, domain, accessibility, and demo-fragility reviews.
- [ ] Search fixtures, logs, screenshots, prompts, environment files, and Git history for sensitive data.
- [ ] Verify a clean-clone setup and deterministic offline-capable fallback.
- [ ] Deploy the stable build and verify public/incognito access.
- [ ] Rehearse and record the under-three-minute demo.
- [ ] Finalize architecture image, limitations, submission copy, and tested demo runbook.
- [ ] Capture the exact release commit/tag, backup deployment, and submission confirmation.
- [ ] Complete final state/log updates and archive the execution plan when appropriate.

### Exit criteria

- [ ] Every item in the documented definition of done is evidenced.
- [ ] The demo resets in one command and completes reliably without privileged access.
- [ ] Functional, simulated, optional, and unavailable capabilities are disclosed accurately.

## Immediate next action

Begin submission hardening unless the human explicitly approves optional bounded AI first.

## Active notes

- The calendar schedule in the plan is a prioritization guide; milestone gates and verified dependencies control execution.
- R001 is the only authorized PF workflow rule.
- KYC, bank verification, extra personas, document extraction, Hindi, semantic routing, and real integrations remain deferred.
- The deterministic domain, validated API, Calm Case File UI, Docker-only Playwright E2E, Impeccable audit/polish, and independent finish review are complete.
- Impeccable is installed project-scoped for Codex. Its hook is enabled through a Docker-wrapped project manifest; user trust in Codex Settings remains required.
- Host-side work is limited to repository edits, repository Git operations, and PF Health-scoped Docker/Compose commands.
