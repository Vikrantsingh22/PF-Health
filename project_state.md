# PF Health Project State

Last updated: 2026-08-27

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

Milestone 2 — deterministic resolution journey: **COMPLETE**

Milestone 3 — minimal mobile-first UI and E2E: **COMPLETE**

Milestone 4 — local submission hardening: **COMPLETE; PUBLIC DEPLOYMENT PENDING**

Milestone 5 — PF Record Laboratory and interaction hardening: **COMPLETE**

The repository now contains a verified Docker-isolated application harness, the pure-domain Ravi oracle, the complete framework-independent reset → assess → confirm → synthetic correction → automatic revalidation lifecycle, its validated `/api/v1` boundary, and the polished Calm Case File UI with Docker-only browser E2E coverage.

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
- Replaceable member/workflow repository ports, Ravi-only `MockEPFOAdapter`, and process-local in-memory workflow repository
- Resolution lifecycle with taxonomy action validation, explicit five-minute confirmation, exact command binding, stale-version protection, and single-use tokens
- Synthetic exit mutation with one snapshot increment, allowlisted append-only audits, and automatic revalidation through the same health engine
- Containerized deterministic `seed:demo` and `reset:demo` commands
- Project-scoped Impeccable skill and Docker-wrapped Codex design-detector hooks for Mission 4 UI work
- Confirmed root `PRODUCT.md` and seed `DESIGN.md` context for the comp-first Mission 4 design workflow
- User-approved Calm Case File composition with refined check-to-dossier bridge, guidance icons, embedded generation provenance, and route surface brief
- Strict Zod-validated `/api/v1` route handlers for member/reset, assessments, issue detail, resolution selection/confirmation/application, and safe audit retrieval
- Mobile-first Calm Case File UI covering welcome, loading, 4/5 summary, issue guidance/evidence, exact synthetic confirmation, revalidation, 5/5 healthy result, audit timeline, reset, and safe retry
- Hardened PF Record Laboratory with editable bounded fictional labels, one issue/action per missing employment, complete compound-rule reporting, chronology-derived exit proposals, explicit reason confirmation, and authored workbench tab geometry
- Laboratory hierarchy refinement with an Edit → Run → Trace hero, grouped previous employments, a distinct current anchor record, deliberate mobile case-file spacing, and a fully outlined confirmation surface
- Evidence-led landing hero that explains record → checks → action before the Guided Ravi and PF Record Laboratory choices, plus deliberate current-record-to-Run spacing
- Shared three-route navigation with a home-linked PF Health brand, plus Guided Ravi-compatible right-side tab/rail chains on both landing choices with inverse Laboratory styling
- `R002@2` pairwise chronology evaluation across every complete previous/previous and previous/current employment interval, with unique affected-record evidence
- Noto Sans Variable typography, semantic color tokens, authored route/owner/evidence icons, visible file geometry, and a solid check-to-dossier bridge
- Digest-pinned, non-root Playwright 1.62.1 E2E service with read-only repository mounting and private-network access to the app
- Scan-mode root `DESIGN.md` and `.impeccable/design.json` documenting the shipped visual system
- Submission brief, tested three-minute runbook, and accessible repo-native architecture SVG
- Production-aware security headers and escaped direction-contract rendering with no unsafe HTML API
- Deterministic `verify:submission` guard for sensitive-value patterns, visibly synthetic fixtures, required artifacts, and no external runtime fetches
- Impeccable Case File repair with contained tab geometry, continuous paper ground, artifact-free check rows, unified 52px confirmation actions, and synchronized design context

## Active mission

No implementation mission is currently active. Mission 19 completed mobile landing-card separation, inverse rail continuity, and Guided Ravi evidence-row spacing without changing product behavior.

## Verification state

- Documentation files populated: yes
- Local Markdown links checked: yes
- Official evidence recorded for R001: yes
- Application install: verified inside Docker with exact lockfile; 443 packages, 0 reported vulnerabilities
- Typecheck/lint/tests/build: passing inside Docker
- E2E demo: three Playwright tests passing in the dedicated Docker service, covering 375×812, 768×900, 1440×1000, keyboard flow, reduced motion, security headers, no horizontal overflow, and the complete hero path
- Deployment: not configured
- Latest laboratory verification: Docker lint, strict typecheck, 51 tests, production build, and 12 Playwright journeys pass; Impeccable layout detection reports no findings; rendered 549px inspection confirms 64px hero-to-Editor spacing, 88px Editor-to-Results spacing, and no horizontal overflow
- Latest landing/action-spacing verification: the same Docker gates and 12 Playwright journeys pass; rendered 549px/1440px inspection confirms responsive hero composition, no horizontal overflow, 24px bottom padding inside the current record, and a 20px gap before Run assessment
- Latest chronology verification: Docker lint, strict typecheck, 53 tests, production build, and 13 Playwright journeys pass; identical default previous intervals now return `R002@2` failure and `REVIEW_REQUIRED`, while equality at adjacent boundaries still passes
- Latest navigation/case-file verification: Docker lint, strict typecheck, 53 tests, production build, and 14 Playwright journeys pass; the Impeccable layout detector reports no findings, and rendered 375px/1440px inspection confirms responsive navigation, exact side-tab/rail joins, inverse Laboratory styling, and no landing overflow
- Latest mobile rhythm verification: Docker lint, strict typecheck, 53 tests, production build, and 15 Playwright journeys pass; rendered 375px/549px landing and 760px Guided Ravi inspection confirms a deliberate visible gap between cards, a continuous 2px inverse rail outline without a top seam, and a 92px evidence-row cadence; the final Impeccable layout detector reports no findings
- Implementation plan reconciled and roughpad initialized: yes
- Verify-before-commit workflow recorded: yes
- `.gitignore` rules verified with representative generated and secret paths: yes
- Docker-only execution policy recorded: yes
- Docker sandbox implemented and verified: yes
- Compose runtime smoke test: HTTP 200 with expected harness content on `127.0.0.1:3000`
- Host dependency/build artifacts created: no
- Deterministic domain, application, and API tests: 32 passing across six harness, normalization, R001, health-engine, resolution-service, and API suites
- Ravi before oracle: verified 4 pass, 1 fail, 0 unknown, one issue, `NEEDS_ATTENTION`
- Ravi after oracle: verified 5 pass, 0 fail, 0 unknown, no issues, `HEALTHY`
- Resolution journey: verified confirmation, exact token binding, stale-version/replay/expiry rejection, one-version mutation, safe audit order, automatic 5/5 revalidation, and partial/complete reset
- Demo commands: `seed:demo` and `reset:demo` both verified in Docker with snapshot 1 and 4/5 `NEEDS_ATTENTION`
- Submission guard: 50 runtime/test/public/environment/prompt-provenance files scanned; synthetic fixture and runtime-network boundaries passed
- Dependency and history hygiene: `npm audit --audit-level=high` reported zero vulnerabilities; scoped Git history scan found no sensitive-value patterns
- Clean production image: no-cache `npm ci` and build succeeded as `pf-health-production:submission`; runtime smoke returned HTTP 200 as non-root with read-only root, all capabilities dropped, and `no-new-privileges`; production headers retained the release CSP while omitting development-only evaluation/WebSocket allowances
- Impeccable integration: project-scoped files installed; hook enabled and adapted to execute through Docker; Codex hook trust remains a user action
- Impeccable final detector: no findings across `src/app` and `src/components`
- Impeccable product context: confirmed and recorded in root `PRODUCT.md`
- Impeccable visual context: root `DESIGN.md` and `.impeccable/design.json` now record the shipped tokens, components, motion, breakpoints, and Calm Case File rules
- Latest full Docker check: lint, strict typecheck, all 32 tests, and production build passed on the polished source tree
- Approved Mission 4 comp: `.impeccable/mocks/approved/pf-health-case-file.png`, with embedded prompt provenance and approval sidecar
- Mission 4 finish gate: audit completed before polish; lowest measured text contrast was 4.69:1, browser logs were clean, reduced-motion handling was corrected, and the independent reviewer returned `ship` after scoring all three fix items resolved
- API boundary: nine dynamic Next.js routes build successfully with strict bodies/responses, `no-store` state headers, stable request IDs/errors, and full 4/5 → 5/5 acceptance coverage
- Responsive visual checks: approved Case File result inspected at 375px, 768px, and 1440px; exact 852×1846 hero comparison checkpoint saved under the ignored review directory
- E2E harness: official Playwright image pinned to `v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e`; internal hostname avoids `.app` HSTS upgrading
- Manual release inspection: 4/5 case file, five rows, no horizontal overflow, no external runtime assets, and no browser warnings/errors
- Demo rehearsal: complete UI path reached the activity timeline in 1.9 seconds of interaction time and was reset afterward; spoken delivery remains governed by the under-three-minute runbook
- Source refresh: SRC-001 official PDF remained reachable; the dead direct FAQ link was replaced with EPFO's working Help page and its narrower role is documented
- UI repair verification: Impeccable initially identified 24 design-scale drifts and the confirmation pass narrowed this to two compact metadata sizes, which were corrected; rendered geometry checks passed at 375px, 768px, and 1440px with zero browser warnings/errors
- Welcome top-tab verification: rendered inspection passed at 375px and 1230px with no horizontal overflow; Docker E2E passed all three tests including the new 375px, 768px, and 1440px geometry assertion; the aggregate check passed lint, typecheck, all 32 tests, and production build
- Welcome silhouette verification: rendered inspection at 375×812 and 770×781 confirmed a 0px upper-left card radius, curved authored top-tab path, protruding right tab, no horizontal overflow, and zero browser warnings/errors; Docker E2E passed all three tests at 375px, 768px, and 1440px, and the aggregate check passed lint, typecheck, all 32 tests, and production build
- Joined welcome rear-layer verification: rendered inspection at phone, 643px, and 1230px widths confirmed opposing top-tab diagonals, a square lower-right corner, a bottom-tapered right tab, and a connected thin lower rail with no visible clipping or background bleed; Docker E2E passed all three tests, including exact decorative-path, overlap, corner-radius, and welcome-overflow assertions at 375px, 768px, and 1440px; the aggregate Docker check passed lint, strict typecheck, all 32 tests, and the production build
- Welcome join-alignment verification: rendered inspection at 375px and the reported 991px width confirmed the `-2px` top-tab alignment, single outer side-tab diagonal, direct tab-to-rail join, and single rounded rail corner with no clipping or background bleed; Docker E2E passed all three tests, including computed offset, exact path, one-pixel join, corner-radius, and overflow assertions at 375px, 768px, and 1440px; the aggregate Docker check passed lint, strict typecheck, all 32 tests, and the production build
- Assessment silhouette-parity verification: rendered inspection of the 4/5 record at 634px and 991px confirmed the shared raised top tab, protruding side tab, connected rail, square joined corners, and contained rows; Docker E2E passed all three tests, including exact record-decoration paths and geometry at 375px, 768px, and 1440px plus decoration presence in the 5/5 state; the aggregate Docker check passed lint, strict typecheck, all 32 tests, and the production build
- Dossier-separation verification: rendered inspection of the amber 4/5 and green 5/5 states at 703px confirmed complete rounded dossier borders and a clean 28px gap with no connecting line or upper tab; Docker E2E passed all three tests, including absent pseudo-content in both dossier states and responsive coverage at 375px, 768px, and 1440px; the aggregate Docker check passed lint, strict typecheck, all 32 tests, and the production build

Never report an unavailable check as passing.

## Open implementation decisions

- Deployment platform after the deterministic demo works locally
- Whether optional AI work is approved after Milestone 3
- Whether to proceed later with the approved concept direction: keep Ravi as a guided tutorial and add an interactive synthetic PF Record Sandbox

Deployment is the only blocker to closing and archiving the submission-hardening plan.

## Risks to carry forward

- Domain drift: do not activate KYC/bank rules from the older plan without complete evidence and approval.
- Scope pressure: finish one reliable hero path before additional fixtures or features.
- Demo fragility: deterministic fallback and reset must not depend on network access.
- Documentation drift: behavior changes require updates to the relevant source docs and this file.
- Optional-AI drift: do not start model integration without explicit human approval; the deterministic demo is complete without it.
- Sandbox escape: reject mounts or commands outside `pf-health`, host-native project execution, and Docker settings that can affect unrelated services.
- Lint-tool migration: Next.js 16.3.2 transitive plugins currently constrain ESLint to the 9.x line; revisit ESLint 10 when the official toolchain supports it without peer overrides.
- CSP compatibility: Next.js hydration requires inline bootstrap scripts; the policy permits inline same-origin scripts but no third-party script origin, and generated/user-controlled rich HTML remains prohibited.

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
# Completed phase — PF Record Laboratory (2026-08-26)

The approved synthetic digital-twin phase is implemented and verified. `/` selects Guided Ravi or PF Record Laboratory; `/guided-ravi` preserves the existing 4/5→5/5 component and oracle; `/laboratory` provides five presets, generated employment editing, transfer/general-health workflows, explicit versioned runs, results, evidence trace/graph, actor plans, confirmed simulations, and strict JSON import/export. The separate `PF_LAB@1` model, process-local APIs, version conflicts, audit lifecycle, and responsive UI are complete. Docker verification passes lint, typecheck, 47 tests, production build, and seven E2E journeys at target widths. The unrelated `next-env.d.ts` worktree change remains excluded.

The root path cards now use the same authored opposing-diagonal case-file tab silhouette as Guided Ravi. The laboratory card’s raised-paper tab carries its deep-blue stroke inside the SVG geometry; exact path and semantic colors are protected by E2E assertions.
