# PF Health Architecture

## Architectural goal

Build a small modular monolith in which deterministic PF health evaluation is independently testable and remains authoritative. Frameworks, persistence, AI, and synthetic integrations surround the domain rather than define it.

The submission-ready visual is available at [`docs/finalist/architecture.svg`](docs/finalist/architecture.svg).

```text
UI / Route Handlers ← Supabase Auth (Google OAuth PKCE + secure cookies)
        |
        v
Application Services ---------------- Audit Log
        |                                  |
        +-----------+----------------------+
        |           |                      |
        v           v                      v
 Health Engine  Resolution Engine     Repository Ports
        |           |                      |
        +-----------+                      v
        |                           Supabase Postgres + owner RLS
        v
Domain Model + Rule Registry
        |
        +--------------------+
        v                    v
Synthetic EPFO Adapter   Optional AI Gateway
```

## Dependency rule

Dependencies point inward. Domain code knows only domain values and interfaces. Application services orchestrate use cases. Adapters implement external concerns. UI renders application responses and dispatches commands.

## Development execution boundary

The development runtime is container-only. Docker/Compose is part of the application harness, not an optional deployment wrapper.

- The host may edit repository files and run repository-scoped Git and PF Health-scoped Docker/Compose commands only.
- Dependency installation, development servers, scripts, tests, typechecking, linting, builds, seed/reset operations, and local application state run inside containers.
- The application container runs as a non-root user on a dedicated bridge network.
- Bind mounts may reference only paths inside the `pf-health` repository. Dependencies and mutable runtime state use named volumes or container storage.
- Published development ports bind to `127.0.0.1`; privileged mode, host networking, host PID/IPC, device mounts, and Docker socket mounts are prohibited.
- Compose operations and cleanup target only the PF Health project; global Docker cleanup is prohibited.

The initial bootstrap must create and verify this sandbox before initializing or running the application toolchain.

## Proposed source layout

```text
src/
  app/                    Next.js pages and route handlers
  application/            use cases and orchestration
  domain/
    model/                member, employment, issue, assessment
    rules/                pure health rules and registry
    resolution/           ownership and action definitions
  adapters/
    epfo/                  MockEPFOAdapter only for MVP
    persistence/           Supabase aggregate stores and persisted schemas
    ai/                    validated model gateway
  components/             presentational UI components
  lib/                    boundary utilities, IDs, time abstractions
tests/
  fixtures/               deterministic synthetic records
  domain/
  application/
  components/
  e2e/
```

The exact folders may evolve during bootstrap, but the boundaries may not be collapsed without updating this document.

## Domain layer

Contains `MemberState`, `EmploymentRecord`, `HealthCheckResult`, `Issue`, `ResolutionAction`, `HealthAssessment`, rules, and workflow context.

It must not import React, Next.js, OpenAI, network clients, environment variables, or database implementations. Rules are pure and deterministic. They return `PASS`, `FAIL`, or `UNKNOWN` with provenance.

## Application layer

Implements use cases such as:

- load a synthetic member;
- evaluate health;
- retrieve issue details;
- begin a resolution;
- simulate an approved correction;
- revalidate after mutation;
- retrieve audit history;
- request optional generated explanation or draft text.

This layer owns sequencing and transaction boundaries. It is the only layer that may coordinate persistence, rule evaluation, auditing, and AI output.

## Resolution engine

Maps a known issue code to supported owners and resolution actions. It never infers government process from free text. A correction command must be validated against the issue's allowed actions and current state before the repository is changed.

## Adapter boundaries

`MemberRecordPort` provides member snapshots and accepts explicit synthetic correction commands. `MockEPFOAdapter` is the only MVP external-system implementation. It must perform no government network requests.

Persistence uses two user-owned JSON aggregates in Supabase Postgres: one row per Guided Ravi run and one row per Laboratory session. Each row has an immutable `owner_user_id` referencing `auth.users`, an optimistic revision, indexed timestamps, and a validated aggregate payload. Domain records do not depend on storage-specific IDs or decorators. The in-memory adapters remain deterministic assembly tools used to evaluate one hydrated aggregate at a time.

Supabase Auth uses Google OAuth with PKCE and cookie-based SSR sessions. The browser starts OAuth through Supabase, and `/auth/callback` exchanges the returned authorization code server-side, attaches the rotated session cookies to the destination redirect, and preserves only a validated relative route intent. Local requests made explicitly to the Docker bind address `0.0.0.0` are canonicalized to `localhost` before PKCE cookies are created so the verifier and callback cannot split across cookie hosts. PF Health requests no Google API scopes beyond the identity scopes Supabase requires and does not read or persist Google provider tokens in application storage. Stateful pages and APIs resolve the verified Supabase user server-side; request bodies and URLs never supply ownership. RLS independently restricts every select, insert, update, and delete operation to `auth.uid() = owner_user_id`.

## AI layer

The optional AI gateway receives minimum necessary structured, synthetic facts and returns validated values. It cannot import repository implementations, run rules, mutate state, or provide authoritative status. The application must have deterministic fallback copy when AI is disabled or invalid.

## Request flow

```text
load member → normalize snapshot → run all rules → build assessment
     → map failures to issues → render summary
     → select resolution → validate command → append audit event
     → apply synthetic mutation → append audit event → rerun rules
     → append revalidation event → render healthy state
```

## State and audit guarantees

- Member snapshots are versioned.
- Mutation uses an expected version to prevent stale writes.
- Assessment results record rule ID, rule version, source IDs, and evaluation time.
- Audit events are append-only and contain no secrets or raw documents.
- Generated prose is not the source of truth and can be regenerated.
- Time and ID generation are injectable in deterministic tests.

## Error policy

- Invalid input: structured `VALIDATION_ERROR`.
- Missing member: `NOT_FOUND`.
- Missing or invalid user session: `UNAUTHENTICATED`.
- Stale mutation: `CONFLICT`.
- Missing evidence: a rule-level `UNKNOWN`, not a server error.
- Unsupported action: `UNSUPPORTED_ACTION` or `REVIEW_REQUIRED`.
- AI failure: deterministic fallback copy; health state is unchanged.

## Deferred architecture

The semantic router, multiple public services, real integrations, generalized workflow catalogs, and distributed services are intentionally deferred. The current `WorkflowContext` supports `GENERAL_HEALTH` and a narrow `TRANSFER` context only so future work is possible without building it now.
# Two-path application composition

`/guided-ravi` hydrates one private Guided Ravi run into the frozen five-check application service. A latest healthy run opens an explicit completed boundary before the user can reset the sample and create a fresh 4/5 run. `/laboratory` hydrates one private Laboratory aggregate into the separate strict schema, `PF_LAB@1` evaluator, evidence/plan builders, and versioned session service. `/history` lists only meaningful owner-scoped evidence: assessed Laboratory sessions and healthy completed Guided Ravi runs; unassessed drafts and incomplete tutorial starts do not appear as history cards. Laboratory sessions are resumable and Guided Ravi runs remain historical evidence. Both paths share authentication, persistence, presentation tokens, and synthetic/non-affiliation boundaries, but Laboratory rules never modify tutorial `MemberState` or APIs.
