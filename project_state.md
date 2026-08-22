# PF Health Project State

Last updated: 2026-08-23

## Purpose

This is the concise cross-chat handoff for PF Health. Read it immediately after `AGENTS.md` at the start of a new task. Update it after every meaningful mission or whenever scope, architecture, implementation status, verification, risks, or the next action changes.

Detailed specifications remain authoritative in their dedicated documents; this file records the current state and points to those sources rather than duplicating them.

## Current objective

Build a reliable synthetic PF-record health prototype around one hero transition:

`Ravi before correction → R001 issue → simulated correction → automatic revalidation → healthy`

The authoritative product journey is `DETECT → EXPLAIN → ASSIGN OWNER → RESOLVE → REVALIDATE`.

## Current phase

Milestone 0 — documentation harness: **COMPLETE**

Milestone 1 — Docker sandbox, project bootstrap, and deterministic domain: **COMPLETE**

Milestone 2 — deterministic resolution journey: **PLANNED; NEXT**

The repository now contains a verified Docker-isolated application harness and complete pure-domain oracle for Ravi before and after correction. Persistence, resolution/application services, API routes, audit storage, and product UI have not yet been implemented.

The repository now also contains `roughpad.md`, the working checklist used to track one active implementation mission at a time. It refines the ordered milestones without replacing the authoritative specifications.

## Locked decisions

- Synthetic data and simulated integrations only.
- No real UAN, Aadhaar, PAN, bank, OTP, employer, claim, or government-account data.
- No EPFO scraping, portal automation, claim submission, or implied affiliation.
- Deterministic rules own health state; AI cannot create, override, resolve, or mutate issues.
- The MVP has one polished persona and one supported PF workflow rule: `R001@1`.
- R001 emits `MISSING_PREVIOUS_EMPLOYMENT_EXIT` for the supported Ravi pre-correction fixture.
- R001 is presented as `ATTENTION`/`NEEDS_ATTENTION`, not a universal blocker.
- The demo shows five checks: D001-D004 are fixture/integrity checks and R001 is the only PF workflow rule.
- `UNKNOWN` and `REVIEW_REQUIRED` are first-class outcomes.
- AI explanation and drafting are optional only after the deterministic UI journey and fallback copy are complete.
- KYC identity mismatch, bank verification, additional personas, document extraction, Hindi, and semantic routing are deferred and require explicit approval.
- Each coherent implementation mission must be verified before it is committed; unrelated changes must not be bundled into that commit.
- All dependency installation, application execution, scripts, tests, builds, seed/reset operations, and local runtime state must run inside the PF Health Docker sandbox.
- Host-side actions are limited to editing files inside `pf-health`, repository-scoped Git, and PF Health-scoped Docker/Compose commands.
- Never mount, modify, or otherwise use project files outside `pf-health`; never use privileged/host namespaces, mount the Docker socket, or mutate unrelated Docker resources.
- The public issue shape includes `titleKey` and `fallbackCopyKey` because the closed issue taxonomy requires them; `DATA_MODEL.md` is reconciled accordingly.

## Source-of-truth order

1. `AGENTS.md` — repository operating rules
2. `project_state.md` — current status and handoff
3. `docs/product/SCOPE.md` — allowed product scope
4. `docs/product/PRD.md` — functional requirements
5. `ARCHITECTURE.md` — layer and dependency boundaries
6. `docs/domain/RULES.md` and `docs/domain/ISSUE_TAXONOMY.md` — authoritative domain behavior
7. `docs/domain/SOURCES.md` — official evidence and limitations
8. `docs/exec-plans/ACTIVE.md` — ordered implementation work

If this summary conflicts with a dedicated source-of-truth document, stop, identify the conflict, and update the documents only after a human decision.

## Completed artifacts

- Root operating docs: `AGENTS.md`, `README.md`, `ARCHITECTURE.md`, `CODEX_LOG.md`
- Product, design, domain, engineering, execution-plan, and finalist documentation
- Official-source register for R001
- Repository-aligned revision of the complete hackathon plan DOCX
- Actionable implementation checklist and working task tracker in `roughpad.md`
- Safe repository `.gitignore` covering dependencies, build/test output, environment files, local state, logs, and editor artifacts
- Digest-pinned, non-root, read-only Docker/Compose development sandbox with repository-only bind mounting, named dependency/build volumes, dedicated networking, and localhost-only port exposure
- Pinned Next.js 16.3.2, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3, ESLint 9.39.5, and Vitest 4.1.11 application harness
- Strict TypeScript, lint, unit-test, aggregate-check, and multi-stage production-build configuration
- Zod-validated strict member boundary and immutable Ravi before/after fixtures
- Framework-independent domain types, D001-D004 demo checks, pure `R001@1`, closed issue registry, and deterministic health engine
- Golden 4/5 `NEEDS_ATTENTION` and 5/5 `HEALTHY` assessments with fixed clock/ID test providers

## Next mission

Implement the deterministic resolution application inside the verified Docker sandbox.

Expected output:

- repository and synthetic-adapter ports;
- Ravi-only local replaceable persistence and deterministic reset/seed;
- resolution opening, allowed-action selection, explicit confirmation, and version protection;
- single-use synthetic correction, append-only safe audit events, and automatic revalidation;
- tests for stale versions, replay, malformed commands, wrong records, unsupported actions, reset, and the successful complete journey;
- no API route, product UI, OpenAI call, real integration, or additional PF rule.

The detailed resolution actions and exit criteria are tracked under Mission 3 in `roughpad.md`.

After bootstrap, implement domain schemas, Ravi before/after fixtures, normalizer, D001-D004, R001, issue registry, health engine, and golden tests in the sequence defined by `docs/exec-plans/ACTIVE.md`.

## Verification state

- Documentation files populated: yes
- Local Markdown links checked: yes
- Official evidence recorded for R001: yes
- Application install: verified inside Docker with exact lockfile; 393 packages, 0 reported vulnerabilities
- Typecheck/lint/tests/build: passing inside Docker
- E2E demo: not implemented
- Deployment: not configured
- Implementation plan reconciled and roughpad initialized: yes
- Verify-before-commit workflow recorded: yes
- `.gitignore` rules verified with representative generated and secret paths: yes
- Docker-only execution policy recorded: yes
- Docker sandbox implemented and verified: yes
- Compose runtime smoke test: HTTP 200 with expected harness content on `127.0.0.1:3000`
- Host dependency/build artifacts created: no
- Deterministic domain tests: 19 passing across harness, normalization, R001, and health-engine suites
- Ravi before oracle: verified 4 pass, 1 fail, 0 unknown, one issue, `NEEDS_ATTENTION`
- Ravi after oracle: verified 5 pass, 0 fail, 0 unknown, no issues, `HEALTHY`

Never report an unavailable check as passing.

## Open implementation decisions

- Local persistence implementation after the pure domain milestone
- Deployment platform after the deterministic demo works locally
- Whether optional AI work is approved after Milestone 3

These decisions do not block the next mission.

## Risks to carry forward

- Domain drift: do not activate KYC/bank rules from the older plan without complete evidence and approval.
- Scope pressure: finish one reliable hero path before additional fixtures or features.
- Demo fragility: deterministic fallback and reset must not depend on network access.
- Documentation drift: behavior changes require updates to the relevant source docs and this file.
- Sandbox escape: reject mounts or commands outside `pf-health`, host-native project execution, and Docker settings that can affect unrelated services.
- Lint-tool migration: Next.js 16.3.2 transitive plugins currently constrain ESLint to the 9.x line; revisit ESLint 10 when the official toolchain supports it without peer overrides.

## Handoff update template

After a meaningful mission, update:

- `Last updated`
- `Current phase`
- `Completed artifacts`
- `Next mission`
- `Verification state`
- `Open implementation decisions`
- `Risks to carry forward`

Also add a factual entry to `CODEX_LOG.md`. Do not paste chat transcripts or repeat full specifications here.
