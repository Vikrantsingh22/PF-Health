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

Milestone 1 — project bootstrap and deterministic domain: **PLANNED; BOOTSTRAP NEXT**

The repository currently contains documentation only. No application package, source code, dependencies, scripts, fixtures, or automated tests have been initialized.

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

## Next mission

Bootstrap a strict TypeScript/Next.js project and deterministic test harness only.

Expected output:

- pinned package manifest and lockfile;
- strict TypeScript, lint, test, and build configuration;
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run check`;
- `.env.example` and safe `.gitignore`;
- no UI feature implementation, persistence, OpenAI call, or additional PF rule yet.

The detailed bootstrap actions and exit criteria are tracked under Mission 1 in `roughpad.md`.

After bootstrap, implement domain schemas, Ravi before/after fixtures, normalizer, D001-D004, R001, issue registry, health engine, and golden tests in the sequence defined by `docs/exec-plans/ACTIVE.md`.

## Verification state

- Documentation files populated: yes
- Local Markdown links checked: yes
- Official evidence recorded for R001: yes
- Application install: not available
- Typecheck/lint/tests/build: not available
- E2E demo: not implemented
- Deployment: not configured
- Implementation plan reconciled and roughpad initialized: yes
- Verify-before-commit workflow recorded: yes
- `.gitignore` rules verified with representative generated and secret paths: yes

Never report an unavailable check as passing.

## Open implementation decisions

- Exact framework/package versions to pin during bootstrap
- Local persistence implementation after the pure domain milestone
- Deployment platform after the deterministic demo works locally
- Whether optional AI work is approved after Milestone 3

These decisions do not block the next mission.

## Risks to carry forward

- Domain drift: do not activate KYC/bank rules from the older plan without complete evidence and approval.
- Scope pressure: finish one reliable hero path before additional fixtures or features.
- Demo fragility: deterministic fallback and reset must not depend on network access.
- Documentation drift: behavior changes require updates to the relevant source docs and this file.

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
