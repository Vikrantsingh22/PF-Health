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

The repository contains the documentation harness, implementation plan, and a verified Docker-isolated Next.js/TypeScript application harness. Product domain behavior has not yet been implemented.

All development, dependency installation, application execution, testing, and builds must run inside the repository-defined Docker environment. Do not run project package-manager or application commands directly on the host. Host access is limited to files inside this repository, repository-scoped Git operations, and PF Health-scoped Docker/Compose commands.

## Start here

- Agent operating rules: [`AGENTS.md`](AGENTS.md)
- Current cross-chat handoff: [`project_state.md`](project_state.md)
- Product requirements: [`docs/product/PRD.md`](docs/product/PRD.md)
- Scope guardrails: [`docs/product/SCOPE.md`](docs/product/SCOPE.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Active execution plan: [`docs/exec-plans/ACTIVE.md`](docs/exec-plans/ACTIVE.md)
- Domain rule evidence: [`docs/domain/SOURCES.md`](docs/domain/SOURCES.md)

## Pinned bootstrap stack

- Node.js 24.19.0 from a digest-pinned official container image
- Next.js 16.3.2 App Router and React 19.2.8
- TypeScript 6.0.3 in strict mode
- Tailwind CSS 4.3.3
- Vitest 4.1.11
- Docker/Compose sandbox with a non-root application user, read-only root filesystem, and isolated network

Zod, Testing Library, Playwright, local persistence, and optional OpenAI integration remain deferred until the milestone that first requires each dependency.

## Containerized development

Docker 29.5.3 and Docker Compose v5.1.4 were used to verify the bootstrap. From the `pf-health` repository root:

```bash
docker compose build app
docker compose run --rm app npm ci
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run test
docker compose run --rm app npm run check
docker compose up app
```

Open `http://127.0.0.1:3000` after the app reports ready. Stop only this project with `docker compose down`. Dependencies and Next build output remain in PF Health-named Docker volumes; no host `node_modules` or `.next` directory is created.

To verify the clean multi-stage production image:

```bash
docker build --target production --tag pf-health-production:local .
```

E2E, demo seed, and reset scripts will be introduced by the milestones that implement those behaviors. Do not invoke or claim them before they exist.

## Delivery order

1. Docker sandbox and repository/test harness
2. Domain types and Ravi fixtures
3. R001 and deterministic health engine
4. Resolution, simulated correction, revalidation, and audit events
5. Minimal end-to-end UI
6. Optional bounded AI explanation and drafting
7. Accessibility, responsive polish, and adversarial review

See [`docs/product/DEMO.md`](docs/product/DEMO.md) for the three-minute presentation path.
