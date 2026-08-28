# PF Health Working Roughpad

Last updated: 2026-08-29

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

## Mission 20 — Supabase authentication and durable history

**Status:** COMPLETE LOCALLY; VERCEL CONFIGURATION PENDING

**Goal:** Replace process-local workflow state with user-owned Supabase persistence, add passwordless email OTP authentication, and let each authenticated user privately revisit their Guided Ravi and Laboratory history on Vercel.

- [x] Validate repository instructions, source-of-truth documents, and required environment-variable names without exposing values.
- [x] Record and verify current package release/download eligibility before installing Supabase dependencies.
- [x] Add reproducible database migrations for user-owned Guided Ravi state, Laboratory sessions, and history.
- [x] Add cookie-based Supabase SSR authentication and protect stateful pages and APIs.
- [x] Replace Guided Ravi and Laboratory process-local stores with owner-scoped persistent repositories and optimistic concurrency.
- [x] Add passwordless email OTP, sign-out, shared authenticated navigation, and private `/history` views.
- [x] Add ownership-isolation, persistence, auth, history, and regression tests.
- [x] Run migrations, lint, typecheck, tests, E2E, submission verification, and production build inside Docker.
- [x] Update architecture, contracts, security, operational docs, persistent state, and Codex log.
- [x] Inspect the final diff and create focused verified commits.

**Environment readiness:** `.env.local` exists and defines `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, and `DIRECT_DATABASE_URL`; values were not printed or copied.

**Verification:** The idempotent migration reapplied successfully. Live anonymous RLS verification passed. Docker `npm run check` passed lint, strict typecheck, 59 tests across 12 files, and the production build. Submission verification scanned 94 files, the production dependency audit reported zero vulnerabilities, and Docker Playwright passed the two public/auth-boundary journeys while explicitly skipping 13 authenticated journeys because no storage state was supplied. In-app browser inspection confirmed the landing page and `/laboratory` → `/login?next=%2Flaboratory` redirect with no console errors. Implementation commit: `96d00d2`.

## Mission 21 — Google OAuth migration

**Status:** COMPLETE LOCALLY; GOOGLE/SUPABASE PROVIDER CONFIGURATION PENDING

**Goal:** Replace rate-limited Supabase email OTP sign-in with Supabase Google OAuth while preserving SSR cookies, Auth UUID ownership, RLS, private history, and protected-route redirects.

- [x] Replace the email/code form with one Google OAuth action.
- [x] Exchange the PKCE authorization code in a safe server callback.
- [x] Update auth tests, browser assertions, security/contracts, deployment guidance, and continuity records.
- [x] Run Docker checks, browser boundary coverage, submission/security gates, and production build.
- [x] Inspect and commit only the verified migration.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 62 tests across 13 files, and the production build with `/auth/callback`. Live anonymous RLS verification passed, submission verification scanned 95 files, and the production audit reported zero vulnerabilities. Docker Playwright passed the two public/auth-boundary journeys and explicitly skipped 13 journeys requiring authenticated storage state. In-app browser inspection confirmed the Google login surface and protected-route redirect with no console errors. A real Google consent/persistence smoke remains blocked only on account-owner provider configuration and sign-in. Commit: `c6ca5cd`.

**Provider follow-up (2026-08-28):** After dashboard configuration, local OAuth initiation reached Google's account-access boundary through Supabase. Manual account selection remains required before verifying callback return, persistence, and sign-out.

## Mission 22 — Authenticated end-to-end acceptance

**Status:** COMPLETE

**Goal:** Verify the configured Google OAuth flow, owner-scoped Laboratory and Guided Ravi persistence, private history/resume, reload survival, sign-out, and protected-route redirect in the browser.

- [x] Complete Google sign-in through the configured Supabase provider.
- [x] Run and persist a Laboratory assessment, then verify history and resume after reload.
- [x] Complete Guided Ravi from 4/5 through confirmed correction, 5/5 revalidation, and the eight-event activity timeline.
- [x] Reload private history and verify both Laboratory and Guided Ravi records remain owner-scoped and resumable.
- [x] Sign out and verify `/history` redirects to `/login?next=%2Fhistory`.
- [x] Record exact evidence and commit the continuity update.

**Verification:** Real Google OAuth returned to the requested Laboratory route with an authenticated Supabase session. The Missing exit preset produced Snapshot 1 with `NEEDS ATTENTION`, R001 failure, evidence, and an actor plan; private history survived reload and resumed the same session. Guided Ravi persisted Snapshot 2, two assessments, and eight events after the deterministic 4/5 → 5/5 journey. Sign-out returned home and direct access to `/history` redirected to `/login?next=%2Fhistory`. Docker `npm run check` passed lint, strict typecheck, 62 tests across 13 files, and the production build. Live anonymous RLS verification passed, submission verification scanned 95 files, and Docker Playwright passed two public/auth-boundary journeys while explicitly skipping 13 journeys that require authenticated storage state and were exercised manually.

## Mission 23 — Authentication continuity and responsive navigation repair

**Status:** COMPLETE

**Goal:** Make Google OAuth complete in one attempt with the requested protected destination restored, keep navigation stable across responsive widths and auth states, prevent stale/foreign history presentation, and make completed Guided Ravi runs explicitly resumable or resettable.

- [x] Reproduce all reported failures from a cleared localhost session.
- [x] Fix OAuth callback/session continuity and safe `next` restoration for Laboratory, Guided Ravi, and direct sign-in.
- [x] Repair shared navigation layout at mobile and intermediate widths.
- [x] Verify private history empty/loading/owned-data behavior from a fresh authenticated account state.
- [x] Show a completed-run choice before replaying Guided Ravi, including an explicit reset path.
- [x] Add regression tests and complete Docker plus clean-session browser verification.
- [x] Update continuity records and commit focused verified changes.

**Verification:** After Supabase sign-out cleared the localhost auth session, one Continue-with-Google action returned directly to `/laboratory`; a second clean cycle returned directly to `/guided-ravi`. Both destinations immediately rendered authenticated navigation. The header had five contained, non-overlapping actions and no horizontal overflow at 375px, 600px, and 720px. History excluded unassessed `NOT RUN` Laboratory drafts while retaining the assessed session and healthy Guided Ravi evidence. The latest completed tutorial showed View History and explicit Reset actions; Reset created one fresh run and returned to 4/5. A fresh browser tab had no warnings or errors, and the final state was signed out at `/login?next=%2Flaboratory`. Docker `npm run check` passed lint, strict typecheck, 67 tests across 15 files, and production build. Docker Playwright passed three public/auth-boundary journeys and explicitly skipped 14 storage-state journeys covered by the real authenticated browser run. Live anonymous RLS verification passed, and submission verification scanned 97 files. Implementation commit: `ab4f613`.

## Mission 11 — PF Record Laboratory

**Status:** COMPLETE

**Goal:** Add a deterministic synthetic PF record laboratory while preserving Guided Ravi unchanged.

- [x] Define strict versioned scenario, session, assessment, evidence, actor-plan, and audit contracts.
- [x] Implement `PF_LAB@1` rules R001–R003 with required outcome precedence.
- [x] Add five presets, process-local sessions, optimistic versions, confirmed simulations, reset, import, and export-safe scenario documents.
- [x] Add the seven laboratory API route groups.
- [x] Verify the core in Docker: lint, typecheck, 44 tests, and production build pass.
- [x] Build `/`, `/guided-ravi`, and `/laboratory` experiences.
- [x] Add laboratory and preserved-Ravi Docker E2E coverage.
- [x] Complete responsive/a11y review, docs, final Docker checks, and focused commits.

**Verification:** Docker `npm run check` passed with 47 tests across nine files and a production build. Docker Playwright passed seven journeys. Impeccable’s six-fix verdict pass scored every item resolved and returned `ship`. Core commit: `7fc79b4`; UI/E2E commit: `436b78c`.

## Mission 12 — Landing case-file tab refinement

**Status:** COMPLETE

- [x] Replace both rounded landing-card tabs with the approved opposing-diagonal SVG silhouette.
- [x] Keep Guided Ravi’s tab solid deep blue.
- [x] Give the laboratory’s raised-paper tab an inset deep-blue SVG stroke.
- [x] Verify the geometry at 877px and 375px without overflow or detached borders.
- [x] Add E2E assertions for the exact path, fill, and stroke.
- [x] Remove the obsolete pseudo-tab rule and normalize the remaining radius token.

## Mission 13 — Laboratory interaction and compound-rule hardening

**Status:** COMPLETE

- [x] Replace fixed missing-exit values with chronology-derived confirmation fields.
- [x] Report each affected employment and preserve all compound rule violations.
- [x] Remove duplicate controls and allow bounded fictional employer-label editing.
- [x] Apply the authored case-file tab geometry and requested spacing to both workbench panels.
- [x] Remove the mobile sticky-action overlap found during rendered inspection.
- [x] Verify domain, API, UI, responsive layout, and Guided Ravi regression in Docker.
- [x] Update persistent state and Codex log, inspect the diff, and commit the verified change.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 51 tests across nine files, and the production build. The dedicated Docker Playwright service passed all 10 browser journeys, including the unchanged Ravi oracle, dynamic chronology proposal, editable labels, tab geometry, and 375px/768px/1440px overflow checks. Impeccable source detection passed after aligning helper copy to the documented type ramp; rendered URL detection was unavailable in the app image because it intentionally has no Chrome binary, so the bounded desktop/mobile browser inspection and dedicated Playwright container supplied rendered verification instead. Commit: `9e94e90`.

## Mission 14 — Laboratory mobile hierarchy and hero

**Status:** COMPLETE

- [x] Strengthen the laboratory hero while preserving synthetic and deterministic boundaries.
- [x] Establish deliberate mobile rhythm between hero, Editor, and Results case files.
- [x] Group all previous employments together above one visually distinct current employment.
- [x] Give the confirmation surface a complete trustworthy-blue outline and rounded corners.
- [x] Verify responsive hierarchy and existing behavior in Docker.
- [x] Update persistent state and log, inspect the final diff, and commit.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 51 tests across nine files, and the production build. The isolated Playwright service passed all 12 journeys, including the new 549px hierarchy and full confirmation-outline regressions. Impeccable's final layout detector returned no findings. Rendered inspection confirmed a 64px hero-to-Editor gap, an 88px Editor-to-Results gap, no horizontal overflow, and a complete 1px `#0c4b91` confirmation border at mobile and desktop widths. Commit: `8af6bed`.

## Mission 15 — Landing hero and laboratory action spacing

**Status:** COMPLETE

- [x] Add a persuasive landing hero that explains PF Health before the two-path choice.
- [x] Preserve the existing Calm Case File path cards and deterministic/synthetic boundaries.
- [x] Add deliberate space between the current-employment fields and Run assessment.
- [x] Verify landing and laboratory layouts at mobile and desktop widths.
- [x] Run Docker checks and E2E, update continuity records, inspect the diff, and commit.

**Verification:** Impeccable's final layout detector returned no findings. Rendered inspection at 549px and 1440px confirmed the evidence-led hero, responsive one/two-column composition, no horizontal overflow, 24px current-section bottom padding, and a 20px section-to-action gap. Docker `npm run check` passed lint, strict typecheck, 51 tests across nine files, and the production build. The isolated Playwright service passed all 12 journeys. Commit: `8744113`.

## Mission 16 — Pairwise employment-overlap detection

**Status:** COMPLETE

- [x] Reproduce the false pass for two identical previous-employment intervals.
- [x] Extend R002 to compare every complete employment interval pair.
- [x] Preserve boundary equality, incomplete-evidence, and current-record ambiguity behavior.
- [x] Add domain and UI-flow regression coverage.
- [x] Run Docker checks and E2E, update rule documentation and continuity records, inspect the diff, and commit.

**Verification:** Focused Docker domain coverage passed 14 tests, including identical previous intervals and adjacent-boundary behavior. Docker `npm run check` passed lint, strict typecheck, 53 tests across nine files, and the production build. After restarting only the PF Health app service to clear stale hot-reload modules, the isolated Playwright service passed all 13 journeys, including the exact add-two-default-records → `REVIEW_REQUIRED` regression. Commit: `08039bc`.

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

**Status:** LOCAL HARDENING COMPLETE; DEPLOYMENT DECISION REQUIRED

**Goal:** Freeze a credible, resettable submission and prepare the public demo package.

### Actions

- [x] Verify layouts at 375px, 768px, and 1440px through Docker E2E and manual browser inspection.
- [x] Run security, privacy, source, domain, accessibility, and demo-fragility reviews.
- [x] Search fixtures, runtime source, environment example, and scoped Git history for sensitive-value patterns without printing matched values.
- [x] Verify a fresh no-cache Docker install/build and deterministic network-independent fallback. A literal external clean clone is prohibited by the repository-only filesystem boundary.
- [!] Deploy the stable build and verify public/incognito access; requires a selected platform/account.
- [x] Rehearse the complete click path under three minutes and leave the UI reset. A presentation recording remains a deployment/final-submission task.
- [x] Finalize architecture image, limitations, submission copy, and tested demo runbook.
- [!] Capture the release tag, backup deployment, and submission confirmation after deployment is selected.
- [x] Complete local-hardening state/log updates; keep the execution plan active until deployment is verified.

### Exit criteria

- [!] Every local item in the documented definition of done is evidenced; public deployment evidence remains pending.
- [x] The demo resets in one command and completes reliably without privileged access.
- [x] Functional, simulated, optional, and unavailable capabilities are disclosed accurately.

## Immediate next action

Return to deployment selection. Optional AI and the Record Sandbox remain separately deferred.

## Mission 7 — Case File UI defect repair

**Status:** COMPLETE

**Goal:** Use a bounded Impeccable audit-to-polish pass to repair the existing Case File UI without changing product behavior, factual copy, or the approved visual world.

### Actions

- [x] Reproduce the reported right-tab overflow, page-background bleed, row-03 overlay, welcome-tab alignment, and confirmation-button size drift.
- [x] Run the repository Impeccable detector and classify verified findings.
- [x] Repair the defects at the narrowest shared CSS/component level.
- [x] Verify welcome, assessment, confirmation, healthy, timeline, and reset states at 375px, 768px, and 1440px.
- [x] Run Docker E2E, the full aggregate check, and the submission guard.
- [x] Update continuity files and inspect the final diff; commit remains the final handoff action.

### Boundaries

- Do not implement the Record Sandbox in this mission.
- Do not add AI, PF rules, personas, routes, dependencies, or external integrations.
- Preserve the Calm Case File identity, one-primary-action flow, and deterministic behavior.

## Mission 8 — Sequential welcome Case File refinements

**Status:** COMPLETE

**Goal:** Apply the human-reported welcome-screen Case File refinements one at a time, preserving the approved visual world and behavior.

### Current action — top-left tab

- [x] Move the deep-blue top-left tab above the welcome-card border instead of clipping it inside the surface.
- [x] Add responsive geometry coverage at 375px, 768px, and 1440px.
- [x] Inspect the rendered welcome state at desktop and mobile widths.
- [x] Run Docker E2E and the aggregate check.
- [x] Update continuity records and commit only this first refinement.

### Current action — complete welcome silhouette

- [x] Square the welcome card's top-left corner beneath the tab.
- [x] Replace the rounded rectangle tab with a curved trapezoid/file-tab silhouette.
- [x] Add the requested protruding deep-blue right-side welcome tab.
- [x] Extend responsive geometry coverage and inspect all supported widths.
- [x] Run Docker E2E and the aggregate check.
- [x] Update continuity records and commit the verified second refinement.

### Current action — join the rear tab layer

- [x] Give the welcome top tab opposing diagonal sides while preserving its rounded top shoulders.
- [x] Square the welcome card's bottom-right corner.
- [x] Reshape the protruding right tab with diagonal lower shoulders and join it to a thin deep-blue lower rail.
- [x] Inspect the rendered silhouette at phone, intermediate, and wide widths.
- [x] Pass the three-width Docker E2E geometry coverage with no welcome-state horizontal overflow.
- [x] Run the aggregate Docker check, finalize continuity records, and commit the verified refinement.

### Current action — align the welcome tab joins

- [x] Shift the authored top tab to `left: -2px` against the welcome card at every viewport.
- [x] Remove the right tab's lower-left diagonal while retaining its outer lower diagonal.
- [x] Join the remaining diagonal directly to the thin rail and keep only the rail's outer bottom-right corner rounded.
- [x] Inspect the result at 375px and the reported 991px desktop width.
- [x] Pass Docker E2E coverage at 375px, 768px, and 1440px.
- [x] Run the aggregate Docker check, finalize continuity records, and commit the verified refinement.

### Boundaries

- Do not change product behavior, copy, routes, rules, dependencies, or the subsequent Case File states.
- Preserve the unrelated generated `next-env.d.ts` worktree change and exclude it from this mission's commit.

## Mission 18 — Shared navigation and landing rear layers

**Status:** COMPLETE

**Goal:** Complete navigation across all product routes and carry the Guided Ravi side-tab/rail chain onto both landing choices with intentional inverse styling.

### Actions

- [x] Add shared Home, Guided Ravi, and Laboratory navigation with a home-linked PF Health brand.
- [x] Remove the laboratory-specific navbar label from the visible route header.
- [x] Add the exact Guided Ravi right-side trapezoid and rail geometry to both landing cards.
- [x] Use deep blue for Guided Ravi and raised paper with a deep-blue outline for Laboratory.
- [x] Verify responsive geometry and all route links in Docker.
- [x] Update continuity records and commit only the verified mission files.

### Boundaries

- Preserve route behavior, deterministic rules, laboratory state, and Guided Ravi content.
- Preserve the unrelated generated `next-env.d.ts` worktree change and exclude it from this mission's commit.

## Mission 19 — Mobile Case File separation and rail continuity

**Status:** COMPLETE

**Goal:** Give the stacked landing choices deliberate separation, make the inverse Laboratory tab and rail read as one continuous outlined layer, and align the Guided Ravi evidence disclosure with the guidance-row rhythm.

### Actions

- [x] Reserve a 64px gap between stacked landing Case Files.
- [x] Match the inverse rail to the tab's paper fill and 2px deep-blue outline.
- [x] Remove the rail's top border so the tab-to-rail join reads continuously.
- [x] Match the evidence summary's vertical padding to adjacent guidance rows.
- [x] Verify mobile and desktop rendering, responsive overflow, keyboard flow, and Docker gates.
- [x] Update persistent state and log, then commit the verified mission without `next-env.d.ts`.

### Boundaries

- Preserve copy, routes, deterministic behavior, and all Case File interactions.
- Preserve the unrelated generated `next-env.d.ts` worktree change and exclude it from this mission's commit.

## Mission 24 — Responsive hamburger navigation and shared safety ribbon

**Status:** COMPLETE

- [x] Inspect the shared header, route-level ribbons, and responsive layouts.
- [x] Implement a keyboard-accessible icon-only mobile menu through tablet widths.
- [x] Replace route-specific notices with one shared full-width safety ribbon.
- [x] Inspect landing, login, Guided Ravi, Laboratory, and History at mobile and desktop widths.
- [x] Fix discovered spacing, wrapping, focus, and horizontal-overflow defects.
- [x] Run Docker lint, typecheck, tests, build, and Playwright verification.
- [x] Update persistent state and log, inspect the final diff, and commit the verified mission.

**Verification:** Browser inspection at 375px, 768px, 877px, and 1440px confirmed one full-width safety ribbon on Landing, Guided Ravi, Laboratory, Login, and History; icon-only collapsed navigation through 960px; normal desktop navigation above that breakpoint; and no horizontal overflow. The Laboratory legacy ribbon is hidden with its legacy header. Docker `npm run check` passed lint, strict typecheck, 67 tests across 15 files, and production build. Docker Playwright passed three public/auth-boundary journeys and skipped 14 authenticated storage-state journeys; their responsive route shells were inspected with the active authenticated browser session. Implementation commit: `b17227b`.

## Mission 25 — Vercel adapter and standalone-output compatibility

**Status:** COMPLETE; REDEPLOYMENT PENDING

- [x] Reproduce the reported Next.js 16.3/Vercel adapter trace failure from its exact error signature.
- [x] Keep `output: "standalone"` for Docker while leaving output unset under `VERCEL=1`.
- [x] Add regression coverage for both deployment modes.
- [x] Verify a Vercel-mode build and confirm it produces native output without `.next/standalone`.
- [x] Run the full Docker check and confirm the normal build still produces `.next/standalone/server.js`.
- [x] Update deployment guidance and continuity records.

**Verification:** `VERCEL=1 npm run build` passed in Docker and omitted `.next/standalone`. The normal Docker `npm run check` passed lint, strict typecheck, 69 tests across 16 files, and production build; `.next/standalone/server.js` remained present for the production image. Implementation commit: `410be54`. A public Vercel redeployment is the remaining acceptance step.

## Active notes

- The calendar schedule in the plan is a prioritization guide; milestone gates and verified dependencies control execution.
- R001 is the only authorized PF workflow rule.
- KYC, bank verification, extra personas, document extraction, Hindi, semantic routing, and real integrations remain deferred.
- The deterministic domain, validated API, Calm Case File UI, Docker-only Playwright E2E, Impeccable audit/polish, and independent finish review are complete.
- Impeccable is installed project-scoped for Codex. Its hook is enabled through a Docker-wrapped project manifest; user trust in Codex Settings remains required.
- Host-side work is limited to repository edits, repository Git operations, and PF Health-scoped Docker/Compose commands.
- Local submission hardening added security headers, prohibited-data verification, three-width E2E, a clean production smoke test, refreshed official-source metadata, and final submission/architecture artifacts.

## Mission 26 — Public Codex build story and contribution ledger

**Status:** COMPLETE

- [x] Add a clear Built with Codex disclosure to the landing page.
- [x] Add a primary landing-hero CTA for the Codex build journey.
- [x] Add a public `/codex` route explaining the human/Codex collaboration.
- [x] Render every dated entry from the curated `CODEX_LOG.md` ledger without unsafe HTML.
- [x] State that raw private chats, credentials, provider tokens, and secret values are excluded.
- [x] Add the descriptive Codex Build Journey route to shared navigation.
- [x] Add parser and public-route browser regressions.
- [x] Run Docker lint, typecheck, tests, production build, and Playwright.
- [x] Inspect the route at mobile and desktop widths with no overflow or actionable console errors.
- [x] Verify Vercel-mode output traces the complete curated ledger into the `/codex` server function.
- [x] Update final verification records and commit the verified mission.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 70 tests across 17 files, and the production build with `/codex` present. Docker Playwright passed all four public journeys and skipped 14 authenticated storage-state journeys; the new route and landing CTA passed at 375px, 768px, and 1440px with no overflow or actionable console errors. Browser inspection confirmed the CTA is visible in a 1280×720 landing viewport and the Codex hero exposes its explanation and verification loop in the first viewport. The Vercel-mode build passed and its `/codex` NFT trace explicitly includes `CODEX_LOG.md`.

**Boundary:** Codex is presented as the implementation and verification collaborator. Human product direction and deterministic, evidence-backed PF rules remain authoritative.

## Mission 27 — Reviewer-facing source repository link

**Status:** COMPLETE

- [x] Add a clear external GitHub source action to the landing-page build proof.
- [x] Add the same source action to the public Codex Build Journey hero.
- [x] Open links in a separate tab with `noopener noreferrer` isolation.
- [x] Add browser regressions for URL and external-link attributes.
- [x] Run Docker checks and responsive browser inspection.
- [x] Update continuity records and commit the verified change.

**Boundary:** The repository may remain private through the submission deadline. Reviewers without GitHub access will be able to open it only after it is made public or they are granted collaborator access.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 70 tests across 17 files, and the production build. Docker Playwright passed all four public journeys at 375px, 768px, and 1440px; 14 authenticated storage-state journeys were skipped by design. Submission verification passed across 105 files. Browser inspection confirmed the `/codex` hero source CTA on desktop and the stacked landing proof actions on mobile with no visible overflow. Implementation commit: `96b6674`.

## Mission 28 — GitHub source icon refinement

**Status:** COMPLETE

- [x] Add one reusable, decorative GitHub brand icon to the project icon module.
- [x] Replace the source-link arrows on Landing and `/codex` with the icon.
- [x] Preserve the plain accessible link name and secure external-tab behavior.
- [x] Run Docker lint, typecheck, tests, build, and responsive Playwright coverage.
- [x] Inspect the rendered `/codex` hero source action.

**Verification:** Docker `npm run check` passed lint, strict typecheck, 70 tests across 17 files, and production build. Docker Playwright passed four public journeys across 375px, 768px, and 1440px; 14 authenticated journeys were skipped by design. Browser inspection confirmed the 20px GitHub icon is aligned and legible in the `/codex` hero CTA.

## Mission 9 — Assessment Case File silhouette parity

**Status:** COMPLETE

**Goal:** Apply the verified welcome Case File rear-layer geometry to the reusable 4/5 and 5/5 record surfaces without changing their content or behavior.

### Actions

- [x] Extract one shared authored top-tab, side-tab, and rail decoration component.
- [x] Place the assessment content in a clipped inner surface so rows retain correct corner containment.
- [x] Give the assessment surface square joined corners and the same protruding rear-layer geometry as welcome.
- [x] Inspect the 4/5 assessment at 634px and 991px.
- [x] Verify the shared decorations remain present in the 5/5 state.
- [x] Pass Docker E2E geometry coverage at 375px, 768px, and 1440px.
- [x] Run the aggregate Docker check, finalize continuity records, and commit the verified refinement.

### Boundaries

- Do not change product behavior, copy, check order, issue disclosure, rules, dependencies, or later screens.
- Preserve the unrelated generated `next-env.d.ts` worktree change and exclude it from this mission's commit.

## Mission 10 — Dossier separation cleanup

**Status:** COMPLETE

**Goal:** Remove the connector line and raised upper tab between the record Case File and dossier in both the 4/5 issue and 5/5 healthy states.

### Actions

- [x] Remove the shared dossier connector pseudo-elements.
- [x] Preserve a consistent 28px gap and complete rounded dossier border.
- [x] Inspect the amber 4/5 and green 5/5 dossier states at the reported 703px width.
- [x] Assert that neither dossier state generates connector pseudo-content.
- [x] Pass Docker E2E coverage at 375px, 768px, and 1440px.
- [x] Run the aggregate Docker check, finalize continuity records, and commit the verified refinement.

### Boundaries

- Do not change product behavior, copy, check order, guidance content, rules, dependencies, or later screens.
- Preserve the unrelated generated `next-env.d.ts` worktree change and exclude it from this mission's commit.
