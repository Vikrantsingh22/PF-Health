# PF Health Testing Strategy

## Goal

Give developers and coding agents a fast deterministic oracle. Tests prove domain behavior and the complete hero transition; visual inspection alone is insufficient.

## Execution policy

All test, lint, typecheck, build, seed/reset, and application commands run inside the PF Health Docker/Compose sandbox. Do not install dependencies or execute project tooling directly on the host. Test evidence must name the container command used.

Before application tests exist, verify the sandbox itself: Compose configuration resolves, no mount escapes `pf-health`, no service is privileged or uses host namespaces, the application user is non-root, and any published port binds only to `127.0.0.1`.

## Expected commands

After bootstrap:

```bash
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run test
docker compose run --rm e2e
docker compose run --rm app npm run check
```

The containerized `npm run check` runs lint, typecheck, unit/integration tests, and the production build. E2E runs separately in the digest-pinned, non-root `e2e` service so browser binaries never need to be installed in the application image. Completion reports must state whether both stages ran.

## Test layers

### Schema and normalization tests

- Valid Ravi fixtures normalize predictably.
- Missing/malformed dates and ambiguous employment status are rejected or preserved as unknown.
- Unknown fields are rejected at external boundaries.
- Normalization never invents exit data.

### Pure rule tests

R001 must cover:

1. Previous employment missing both exit fields → fail with one expected issue.
2. Missing exit date only → fail.
3. Missing exit reason only → fail under the supported synthetic scenario.
4. Complete previous employment → pass.
5. No unambiguous previous employment → unknown, not pass.
6. Malformed required field → unknown.
7. Current employment with no exit data → does not trigger R001.
8. Multiple affected previous records → one issue with all affected IDs.
9. Provenance equals `R001@1` and `SRC-001`, `SRC-002`.

Every rule test names which documented condition it proves.

### Health engine tests

- Stable order and exactly five MVP checks.
- Ravi before correction: 4 pass, 1 fail, 0 unknown, one expected issue, `NEEDS_ATTENTION`.
- Ravi after correction: 5 pass, zero issues, `HEALTHY`.
- Unknown precedence produces `REVIEW_REQUIRED` where documented.
- Assessment counts and snapshot versions are internally consistent.
- Fixed clock/ID providers make results reproducible.

### Resolution/application tests

- Only taxonomy-listed actions are selectable.
- Selection alone does not mutate state.
- Simulation requires explicit confirmation and correct expected version.
- Wrong member/record, stale version, replayed token, invalid date, and unsupported action fail safely.
- Successful mutation increments snapshot version once, writes expected fields, appends audit events, and automatically revalidates.
- An issue disappears only because the updated snapshot passes R001.
- AI unavailable/invalid does not block resolution.

### API contract tests

- Request/response schemas and stable error envelope
- 404, validation, conflict, unsupported-action, and internal-error mapping
- No unexpected fields or sensitive values
- AI routes return deterministic fallback on provider failure

### Component tests

- Status text and accessible names, not implementation details
- Unknown is not displayed or counted as healthy
- One primary action per relevant screen
- Simulation warning and exact change are visible before confirmation
- Loading, error, empty, retry, and healthy states
- Keyboard interaction and focus movement
- Reduced-motion behavior where material

### E2E hero test

From a reset state:

1. Open welcome.
2. Load Ravi.
3. Observe 4/5 and the exact R001 issue.
4. Open issue and evidence.
5. Begin supported resolution.
6. Confirm synthetic-only warning.
7. Apply correction.
8. Observe revalidation and 5/5.
9. Verify issue absence, corrected field, and audit events.
10. Reset and prove the initial state returns.

Run at a mobile viewport at minimum. Add 768px and 1440px smoke coverage or visual checks before submission.

## Fixture policy

- Fixtures are immutable builders or frozen values.
- `raviBeforeCorrection` and `raviAfterCorrection` are explicit, not generated randomly.
- Dates, IDs, clock, and time zone are fixed in tests.
- Fixtures contain no real or realistic government identifiers.
- A test may clone a fixture but never mutate a shared constant.

## Test quality rules

- Prefer behavior assertions over snapshots.
- A test must be able to fail when its acceptance criterion is broken.
- Do not mock the function under test.
- Keep domain tests independent of React, network, database, and AI.
- No live EPFO or model call in default tests.
- Flaky tests are defects; do not hide them with retries without root-cause notes.

## Completion evidence

Report exact container commands, image/build identity where useful, pass/fail counts when available, and any skipped checks. “Tests passed” is insufficient without naming the relevant suite and behavior. If scripts or the Docker harness do not yet exist, say so rather than claiming verification. Host-native results do not satisfy completion criteria.
