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

**Status:** COMPLETE

### Goal

Create a Docker-isolated TypeScript application/test harness and implement the complete deterministic hero case without OpenAI or frontend polish. The Docker sandbox is a prerequisite: no project installation, execution, test, or build may run directly on the host.

### Task sequence

- [x] Add `Dockerfile`, `compose.yaml`, and `.dockerignore` before application initialization
- [x] Configure a non-root app user, dedicated bridge network, named dependency/runtime volumes, and localhost-only port binding
- [x] Verify there are no mounts outside `pf-health`, privileged/host namespaces, device mounts, Docker socket mounts, or unrelated cleanup commands
- [x] Initialize pinned Next.js/TypeScript project with strict settings inside the container
- [x] Add lint, typecheck, unit-test, build, and aggregate check scripts
- [x] Add `.env.example`, safe `.gitignore`, and setup notes
- [x] Implement boundary schemas and domain types
- [x] Add immutable Ravi before/after fixtures
- [x] Implement record normalizer
- [x] Implement D001–D004 demo-integrity checks
- [x] Implement R001 as a pure rule
- [x] Implement issue registry and health engine
- [x] Add unit tests for pass/fail/unknown and golden assessments

### Exit criterion

Given `raviBeforeCorrection`, the engine returns exactly five checks, four passes, one R001 failure, one `MISSING_PREVIOUS_EMPLOYMENT_EXIT` issue, and `NEEDS_ATTENTION`.

Given `raviAfterCorrection`, the engine returns five passes, zero issues, and `HEALTHY`.

No OpenAI call, UI, database, or external network is required. The Docker image builds from a clean repository, the resolved Compose configuration passes the isolation review, and lint, typecheck, unit tests, and production build pass inside the container. No host-native project installation or execution is used.

## Milestone 2 — Deterministic resolution journey

**Status:** COMPLETE

- [x] Implement repository ports and local synthetic adapter
- [x] Implement resolution action validation and lifecycle
- [x] Implement explicit simulated correction with version check
- [x] Append safe audit events
- [x] Revalidate automatically after mutation
- [x] Add application and conflict/replay tests
- [x] Add deterministic reset/seed commands

**Exit criterion:** reset → assess → apply allowed synthetic correction → revalidate → healthy is reproducible through application services.

## Milestone 3 — Minimal UI and E2E

**Status:** COMPLETE

- [x] Welcome, loading, summary, issue, resolution, confirmation, revalidation, healthy, and timeline screens
- [x] Deterministic fallback copy and source disclosure
- [x] Loading/error/retry/unknown-safe states appropriate to the fixed synthetic fixture
- [x] Mobile accessibility and keyboard behavior
- [x] Hero-flow Playwright test in the dedicated Docker E2E service

**Exit criterion:** the complete demo path works at 375px without network access and passes E2E.

## Milestone 4 — Optional bounded AI

**Status:** PENDING; requires explicit approval after Milestone 3

- [ ] Implement validated issue-explanation gateway
- [ ] Implement validated correction-draft gateway
- [ ] Add timeout, invalid-output, injection, and fallback tests
- [ ] Prove that AI cannot alter status, owner, action, or state

## Milestone 5 — Submission hardening

**Status:** LOCAL HARDENING COMPLETE; deployment decision required; optional AI deferred

- [x] Review 375px, 768px, and 1440px layouts
- [x] Run security, privacy, domain, UX, and demo-fragility reviews
- [x] Fix confirmed high-value findings only
- [x] Verify fresh no-cache Docker setup and offline deterministic demo
- [x] Complete Codex log, submission brief, architecture visual, and final runbook
- [ ] Select deployment platform/account and verify public/incognito access
- [ ] Capture release tag, backup deployment, and submission confirmation
- [ ] Archive this plan under `completed/` after the external release gate closes

## Guardrails for every milestone

- Prefer one focused engineering mission per change.
- Run all project installation, execution, tests, and builds inside the PF Health Docker sandbox.
- Never mount or modify files outside `pf-health`, and never mutate unrelated Docker resources.
- Inspect and plan before non-trivial implementation.
- Define acceptance criteria and “do not touch” boundaries.
- Commit coherent missions separately.
- Do not introduce new PF rules or scope without approval.
- Update affected documentation and `CODEX_LOG.md`.

## Active UI repair — Case File polish

**Status:** COMPLETE

- [x] Audit the reported geometry, surface, overlay, and control-size defects with Impeccable and the rendered route
- [x] Repair verified defects without redesigning the Calm Case File or changing behavior
- [x] Verify all journey states and three supported viewport widths
- [x] Run Docker E2E, aggregate checks, and the submission guard; update state/log and commit

The interactive PF Record Sandbox is a later approved direction, not part of this repair.
# Completed: PF Record Laboratory

The approved synthetic digital-twin plan is complete. The frozen Ravi tutorial is available at `/guided-ravi`; the root selects between that tutorial and `/laboratory`. `PF_LAB@1`, five presets, strict scenario JSON, process-local versioned sessions, evidence and actor registries, confirmed simulations, APIs, UI, Docker unit/API/build gates, and seven Docker E2E journeys are implemented. Future AI or real integration work remains separately gated.

# Active: Supabase authentication and durable history

**Status:** LOCAL IMPLEMENTATION COMPLETE; VERCEL CONFIGURATION AND OTP SMOKE PENDING

- [x] Approve passwordless email OTP and authenticated private history.
- [x] Add Supabase SSR/browser clients and secure cookie refresh proxy.
- [x] Add owner-scoped Guided Ravi and Laboratory aggregate tables with complete RLS policies.
- [x] Replace process-local route state with authenticated Supabase Data API stores and optimistic aggregate revisions.
- [x] Add `/login`, authenticated navigation, `/history`, Laboratory resume, and history deletion.
- [x] Complete API auth-boundary, RLS isolation, persistence round-trip, public browser, regression, submission, and production-build verification.
- [ ] Configure Vercel environment variables, production Auth URLs, and custom SMTP, then verify public/incognito access.
