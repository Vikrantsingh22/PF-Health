# PF Health — Agent Instructions

## SAFETY NETS

- Always use the .env file for using any secret or a confidential value
- Install the recent package or library but before installling any package or library check its active weekly downloads and the last release date. Never install the npm package or any library packages which is not older than a week and and have active weekly downloads less than 5k if not then ping the user to make the descision
- While writing code always prefer to use the tailwindcss
- Never create the variable or type which is not required or kept unused

## Workspace and execution boundary

The only project filesystem in scope is this `pf-health` repository. Never create, edit, delete, move, or configure project files outside the repository root. Do not inspect or mutate sibling projects, parent-directory files, user configuration, global package state, or unrelated Docker resources.

Host-side actions are limited to editing files inside `pf-health`, reading repository files, Git operations scoped to this repository, and Docker/Compose commands scoped to the PF Health project. All dependency installation, application execution, scripts, linting, typechecking, tests, builds, database/local-state commands, and development servers must run inside Docker containers—not directly on the host.

The Docker sandbox must:

- use a dedicated Compose project and isolated bridge network;
- run application processes as a non-root user;
- mount only paths inside the `pf-health` repository;
- use container or named-volume storage for dependencies and runtime state;
- publish ports to `127.0.0.1` only and only when required;
- avoid privileged mode, host networking, host PID/IPC namespaces, device mounts, and Docker socket mounts;
- avoid mounting the user home directory, parent directory, sibling repositories, or system paths;
- scope start, stop, logs, and cleanup commands to PF Health services only;
- never run global Docker cleanup commands such as `docker system prune`.

If a required workflow cannot run within this boundary, stop and ask the human rather than weakening isolation.


## Mission

PF Health is an independent hackathon prototype that detects known problems in synthetic EPFO/PF records before those problems interfere with a future transfer or claim workflow.

The core journey is:

`DETECT → EXPLAIN → ASSIGN OWNER → RESOLVE → REVALIDATE`

Do not expand the product beyond this journey unless a human explicitly approves the change.

## Non-negotiable product boundaries

PF Health is not:

- an EPFO replacement or official government service;
- an EPFO chatbot;
- a claim-submission or transfer-submission service;
- a pension, eligibility, tax, or financial-advice calculator;
- connected to any live government system.

All member records, identifiers, documents, employers, corrections, and integrations must be synthetic or simulated.

Never introduce real Aadhaar, PAN, UAN, bank, OTP, credential, claim, or employer data. Never scrape or automate an EPFO website. Never imply government affiliation or guarantee a claim outcome.

## Product truth

The MVP hero case is Ravi Sharma, a synthetic member whose previous employment lacks exit information. The product must detect the condition, explain its limited supported impact, identify the next actor, provide a corrective path, simulate the correction, rerun deterministic checks, and show the healthy state.

Any feature outside the `MUST` list in `docs/product/SCOPE.md` requires explicit human approval.

## Authority model

Deterministic rules are authoritative.

LLMs may:

- turn a structured issue into plain-language copy;
- draft a correction request from approved facts;
- extract a narrowly defined field from a synthetic document;
- translate approved explanations.

LLMs must not:

- determine eligibility or record health independently;
- create, suppress, reclassify, or resolve an issue;
- override a rule-engine result;
- mutate member or workflow state;
- invent government rules, evidence, or citations;
- guarantee transfer, claim, or correction success.

Treat model output as untrusted input. Validate structured output. If deterministic evidence is insufficient, return `UNKNOWN` or `REVIEW_REQUIRED`.

## Source-of-truth map

Read the files relevant to the task before making changes.

At the start of every new task or chat, read `project_state.md` immediately after this file. It is the current handoff; the deeper documents below remain authoritative.

Product:

- `docs/product/PRD.md`
- `docs/product/USER_JOURNEY.md`
- `docs/product/SCOPE.md`
- `docs/product/DEMO.md`

Architecture and contracts:

- `ARCHITECTURE.md`
- `docs/engineering/DATA_MODEL.md`
- `docs/engineering/API_CONTRACTS.md`
- `docs/engineering/SECURITY.md`

Domain:

- `docs/domain/PF_DOMAIN.md`
- `docs/domain/RULES.md`
- `docs/domain/ISSUE_TAXONOMY.md`
- `docs/domain/SOURCES.md`

AI:

- `docs/engineering/AI_BOUNDARIES.md`

Frontend:

- `docs/design/DESIGN.md`
- `docs/design/DESIGN_SYSTEM.md`
- `docs/design/COMPONENTS.md`
- `docs/design/COPY.md`

Delivery:

- `docs/engineering/TESTING.md`
- `docs/exec-plans/ACTIVE.md`
- `project_state.md`
- `CODEX_LOG.md`

`docs/finalist/SEMANTIC_ROUTER.md` is future-facing and explicitly out of MVP scope.

## Engineering rules

- Use TypeScript strict mode and avoid `any`.
- Prefer small, pure domain functions with explicit inputs and outputs.
- Keep framework, persistence, AI, and external-system code outside the domain layer.
- The domain layer must not import React, Next.js, an OpenAI SDK, or a database implementation.
- Keep government adapters behind interfaces. The MVP adapter is synthetic.
- Validate external, persisted, and model payloads with Zod at boundaries.
- Do not hide mutation in getter-style functions.
- Do not duplicate domain rules in UI components, API handlers, prompts, or database queries.
- Every new rule requires a source entry, rule documentation, provenance, and tests.
- Every state transition requires an append-only audit event.
- Persist deterministic facts and rule results separately from generated copy.
- Preserve `UNKNOWN`; do not coerce missing evidence into pass or fail.
- Use accessible semantic HTML and never communicate status by color alone.
- Prefer the smallest complete change. Avoid opportunistic refactors.
- Do not add dependencies, issue codes, API fields, or architectural layers without need.

## Implementation workflow

For a non-trivial task:

1. Read this file and the relevant source-of-truth documents.
2. Inspect the current implementation and Git status.
3. State the implementation plan, affected files, assumptions, and ambiguities.
4. Implement only the smallest complete change.
5. Add or update tests that map to acceptance criteria.
6. Run relevant tests, typecheck, lint, and build checks inside the Docker sandbox.
7. Inspect the resulting diff for scope and documentation drift.
8. Update `CODEX_LOG.md` after a meaningful mission.
9. Update `project_state.md` when current status, decisions, verification, risks, or next work changed.
10. Inspect the final diff and run every relevant verification before committing.
11. Commit each coherent, verified mission with a focused message. Do not mix unrelated user changes into the commit.
12. Report changed files, behavior, verification, commit hash, assumptions, and remaining risks.

Never commit known-broken work. If a required check cannot run, record that fact and do not represent the commit as fully verified.

Do not silently change architecture. If code and source-of-truth documentation conflict, stop and surface the conflict.

## Expected commands

These package scripts become mandatory once the application harness defines them, but they must be invoked through the PF Health Docker/Compose service:

```bash
docker compose build app
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run test
docker compose run --rm app npm run test:e2e
docker compose run --rm app npm run seed:demo
docker compose run --rm app npm run reset:demo
docker compose run --rm app npm run check
docker compose up app
```

Do not run project `node`, `npm`, `npx`, `pnpm`, framework, test, or build commands directly on the host. Do not claim a command works before the project scripts exist. `npm run check` must eventually run lint, typecheck, unit/integration tests, and a production build inside the container; E2E may be a separate containerized CI stage if documented.

## Definition of done

A task is complete only when:

- behavior matches the relevant specification and acceptance criteria;
- relevant tests pass and each critical test proves a named criterion;
- types and lint pass;
- no sensitive or real member data was introduced;
- UI work handles loading, error, empty, unknown, and success states where relevant;
- deterministic behavior remains centralized;
- state changes produce audit events;
- documentation is updated when behavior or contracts change;
- remaining uncertainty is reported honestly.
