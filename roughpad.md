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

**Status:** NEXT

**Goal:** Create a Docker-isolated, runnable, pinned Next.js/TypeScript harness without implementing product features or executing project tooling on the host.

### Actions

- [ ] Verify Docker/Compose availability without changing unrelated services.
- [ ] Add a minimal multi-stage `Dockerfile`, `compose.yaml`, and `.dockerignore`.
- [ ] Configure a non-root application user, dedicated project network, named dependency/runtime volumes, and `127.0.0.1`-only port binding.
- [ ] Verify no mount resolves outside `pf-health`; prohibit privileged mode, host namespaces, devices, added capabilities, and Docker socket access.
- [ ] Inspect container-available Node/package-manager versions and choose pinned framework/tool versions.
- [ ] Initialize Next.js with the App Router, `src/`, strict TypeScript, Tailwind CSS, and ESLint inside the container without overwriting repository documentation.
- [ ] Add the package manifest and lockfile.
- [ ] Configure strict TypeScript with no `any` escape hatch.
- [ ] Configure unit testing for pure TypeScript modules.
- [ ] Add `lint`, `typecheck`, `test`, `build`, and aggregate `check` scripts.
- [x] Add a safe `.gitignore` for dependencies, generated output, local state, secrets, logs, and editor files.
- [ ] Add `.env.example` containing names only, with no secrets.
- [ ] Add minimal setup and command notes to `README.md`.
- [ ] Run a clean image build, containerized dependency install, and all available checks.
- [ ] Review the diff for accidental feature code, sensitive values, or documentation loss.
- [ ] Update `project_state.md`, `CODEX_LOG.md`, and this roughpad with exact results.

### Exit criteria

- [ ] `docker compose config` resolves and passes the isolation review.
- [ ] A clean Docker image build and containerized install succeed from the repository root.
- [ ] Containerized `npm run lint` passes.
- [ ] Containerized `npm run typecheck` passes.
- [ ] Containerized `npm run test` passes with a minimal harness test.
- [ ] Containerized `npm run build` passes.
- [ ] Containerized `npm run check` runs the required aggregate checks and passes.
- [ ] No host `node_modules`, package-manager cache, application process, test runner, or build output is created.
- [ ] No UI feature, PF rule, persistence, network adapter, or OpenAI integration has been added.

## Mission 2 — Deterministic domain foundation

**Status:** BLOCKED BY MISSION 1

**Goal:** Implement the full pure-domain oracle for Ravi before and after correction.

### Actions

- [ ] Create framework-independent domain, schema, fixture, rule, and test modules.
- [ ] Implement Zod boundary schemas matching `docs/engineering/DATA_MODEL.md`.
- [ ] Implement explicit domain types and inject clock/ID providers where needed.
- [ ] Add immutable `raviBeforeCorrection` and `raviAfterCorrection` fixtures.
- [ ] Implement a normalizer that rejects unsupported fields and never invents exit data.
- [ ] Implement D001-D004 as demo-integrity checks with `PASS`/`UNKNOWN` behavior.
- [ ] Implement pure, versioned R001 with `PASS`/`FAIL`/`UNKNOWN` behavior and source provenance.
- [ ] Implement the closed `MISSING_PREVIOUS_EMPLOYMENT_EXIT` issue registry entry.
- [ ] Implement the health engine, stable check order, counts, status precedence, and issue aggregation.
- [ ] Add the complete rule matrix and golden before/after assessment tests from `TESTING.md`.
- [ ] Run all checks and record exact test evidence.

### Exit criteria

- [ ] Before fixture: exactly five checks, four pass, one R001 fail, zero unknown, one expected issue, and `NEEDS_ATTENTION`.
- [ ] After fixture: exactly five passes, zero issues, and `HEALTHY`.
- [ ] Unsupported or ambiguous evidence remains `UNKNOWN`/`REVIEW_REQUIRED`.
- [ ] Domain code imports no React, Next.js, database, network, or OpenAI implementation.
- [ ] Clean install, lint, typecheck, tests, and build pass.

## Mission 3 — Deterministic resolution application

**Status:** BLOCKED BY MISSION 2

**Goal:** Make reset → assess → confirm correction → mutate synthetic state → revalidate reproducible through application services.

### Actions

- [ ] Define repository and adapter ports.
- [ ] Implement the Ravi-only `MockEPFOAdapter` with no government network calls.
- [ ] Implement local replaceable persistence only as needed for the demo lifecycle.
- [ ] Implement resolution creation, allowed-action validation, and action selection.
- [ ] Require explicit confirmation, expected snapshot version, and single-use protection.
- [ ] Apply only the allowed synthetic exit update and increment the snapshot version once.
- [ ] Append allowlisted audit events for each state transition.
- [ ] Re-run the same health engine automatically after mutation.
- [ ] Add deterministic `seed:demo` and `reset:demo` scripts.
- [ ] Test stale versions, replay, invalid dates, wrong records, unsupported actions, and successful revalidation.

### Exit criteria

- [ ] The complete deterministic application journey is reproducible without UI, network, database service, or AI.
- [ ] Every mutation has confirmation, concurrency protection, and append-only audit evidence.
- [ ] Reset restores the exact initial state after complete and partial journeys.
- [ ] All required checks pass.

## Mission 4 — Minimal mobile-first UI and E2E

**Status:** BLOCKED BY MISSION 3

**Goal:** Expose the deterministic hero journey as one accessible, reliable demo flow.

### Actions

- [ ] Implement the six grouped screen states defined in the plan and design documents.
- [ ] Add synthetic-data and non-affiliation disclosure before loading Ravi.
- [ ] Render welcome, loading, summary, issue, resolution, confirmation, revalidation, healthy, timeline, and reset states.
- [ ] Keep one primary action per screen and show impact, owner, evidence, limitation, and next step.
- [ ] Provide deterministic explanation and correction-request fallback copy.
- [ ] Keep `UNKNOWN` and `REVIEW_REQUIRED` visibly distinct from healthy and needs-attention.
- [ ] Add loading, recoverable error, empty, retry, conflict, and stale-state behavior.
- [ ] Verify semantic HTML, keyboard flow, focus behavior, touch targets, and status text independent of color.
- [ ] Add Playwright coverage for the complete mobile hero journey and reset.

### Exit criteria

- [ ] The journey passes at a 375px viewport without network or AI.
- [ ] A user can complete the hero flow without developer guidance.
- [ ] E2E proves 4/5 → correction → automatic revalidation → 5/5 → reset.
- [ ] Lint, typecheck, unit/integration/component tests, build, and E2E pass.

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

Start Mission 1 only: create and verify the Docker sandbox, then select pinned dependencies and initialize the non-feature application harness inside that sandbox while preserving all current documentation.

## Active notes

- The calendar schedule in the plan is a prioritization guide; milestone gates and verified dependencies control execution.
- R001 is the only authorized PF workflow rule.
- KYC, bank verification, extra personas, document extraction, Hindi, semantic routing, and real integrations remain deferred.
- The repository currently has documentation but no initialized application or automated checks.
- Host-side work is limited to repository edits, repository Git operations, and PF Health-scoped Docker/Compose commands.
