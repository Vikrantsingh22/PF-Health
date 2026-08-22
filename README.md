# PF Health

PF Health is a synthetic-data hackathon prototype for checking whether known PF record conditions may interfere with a future workflow. It detects supported issues deterministically, explains them in plain language, identifies the next actor, simulates a correction, and revalidates the record.

> PF Health is independent, unofficial, and not connected to EPFO or any government system. It does not submit claims, determine legal eligibility, or guarantee outcomes.

## Core demo

The hero scenario uses a fictional member, Ravi Sharma:

1. Load Ravi's synthetic PF record.
2. Run five deterministic health checks.
3. Find one issue: missing exit information on a previous employment.
4. Explain why it matters for the supported transfer scenario.
5. Show who needs to act and the available correction path.
6. Simulate the correction locally.
7. Re-run the checks and move from `4/5` to `5/5` healthy.
8. Show the complete audit timeline.

## Repository status

The repository currently contains the documentation harness and implementation plan. Application code, tests, scripts, dependencies, and the Docker sandbox have not yet been initialized. Do not assume the expected commands work until the bootstrap milestone is complete.

All development, dependency installation, application execution, testing, and builds must run inside the repository-defined Docker environment. Do not run project package-manager or application commands directly on the host. Host access is limited to files inside this repository, repository-scoped Git operations, and PF Health-scoped Docker/Compose commands.

## Start here

- Agent operating rules: [`AGENTS.md`](AGENTS.md)
- Current cross-chat handoff: [`project_state.md`](project_state.md)
- Product requirements: [`docs/product/PRD.md`](docs/product/PRD.md)
- Scope guardrails: [`docs/product/SCOPE.md`](docs/product/SCOPE.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Active execution plan: [`docs/exec-plans/ACTIVE.md`](docs/exec-plans/ACTIVE.md)
- Domain rule evidence: [`docs/domain/SOURCES.md`](docs/domain/SOURCES.md)

## Intended stack

- Next.js App Router and React
- TypeScript in strict mode
- Docker/Compose sandbox with a non-root application user and isolated network
- Zod for boundary validation
- Vitest and Testing Library for unit/component tests
- Playwright for the hero-journey E2E test
- A synthetic in-memory or local repository behind interfaces for the MVP
- OpenAI integration only after the deterministic journey is complete

Exact package versions must be selected and pinned during project initialization.

## Expected commands

Once bootstrap is complete, invoke package scripts through the application container:

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

## Delivery order

1. Docker sandbox and repository/test harness
2. Domain types and Ravi fixtures
3. R001 and deterministic health engine
4. Resolution, simulated correction, revalidation, and audit events
5. Minimal end-to-end UI
6. Optional bounded AI explanation and drafting
7. Accessibility, responsive polish, and adversarial review

See [`docs/product/DEMO.md`](docs/product/DEMO.md) for the three-minute presentation path.
