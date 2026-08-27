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

The repository contains the deterministic hackathon product: a Docker-isolated Next.js/TypeScript application, Supabase Google authentication, owner-isolated persistent history, strict `/api/v1` routes, the Ravi health and resolution engines, PF Record Laboratory, and the polished Calm Case File UI. Optional AI and real EPFO integration are intentionally not included.

All development, dependency installation, application execution, testing, and builds must run inside the repository-defined Docker environment. Do not run project package-manager or application commands directly on the host. Host access is limited to files inside this repository, repository-scoped Git operations, and PF Health-scoped Docker/Compose commands.

## Start here

- Agent operating rules: [`AGENTS.md`](AGENTS.md)
- Current cross-chat handoff: [`project_state.md`](project_state.md)
- Product requirements: [`docs/product/PRD.md`](docs/product/PRD.md)
- Scope guardrails: [`docs/product/SCOPE.md`](docs/product/SCOPE.md)
- Architecture: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Active execution plan: [`docs/exec-plans/ACTIVE.md`](docs/exec-plans/ACTIVE.md)
- Domain rule evidence: [`docs/domain/SOURCES.md`](docs/domain/SOURCES.md)
- Submission brief: [`docs/product/SUBMISSION.md`](docs/product/SUBMISSION.md)
- Architecture visual: [`docs/finalist/architecture.svg`](docs/finalist/architecture.svg)

## Pinned bootstrap stack

- Node.js 24.19.0 from a digest-pinned official container image
- Next.js 16.3.2 App Router and React 19.2.8
- TypeScript 6.0.3 in strict mode
- Tailwind CSS 4.3.3
- Vitest 4.1.11
- Zod 4.4.3
- Supabase SSR/Auth and Supabase Postgres with Row Level Security
- Docker/Compose sandbox with a non-root application user, read-only root filesystem, and isolated network

Testing Library and optional OpenAI integration remain deferred. Playwright is present only in the dedicated E2E service.

## Containerized development

Docker 29.5.3 and Docker Compose v5.1.4 were used to verify the bootstrap. From the `pf-health` repository root:

```bash
docker compose build app
docker compose run --rm app npm ci
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm run test
docker compose run --rm app npm run check
docker compose run --rm e2e
docker compose up app
```

Open `http://127.0.0.1:3000` after the app reports ready. Stop only this project with `docker compose down`. Dependencies and Next build output remain in PF Health-named Docker volumes; no host `node_modules` or `.next` directory is created.

To verify the clean multi-stage production image:

```bash
docker build --target production --tag pf-health-production:local .
```

To verify deterministic fixture setup or reset in an isolated process:

```bash
docker compose run --rm app npm run seed:demo
docker compose run --rm app npm run reset:demo
docker compose run --rm app npm run verify:submission
```

Copy `.env.example` to ignored `.env.local` and set the four documented Supabase values. Apply the committed schema and verify anonymous isolation through Docker:

```bash
docker compose --profile migration run --rm migrate
docker compose run --rm app npm run verify:supabase-security
```

For Google sign-in, enable the Google provider in Supabase Auth and place the Google OAuth client ID and secret there—not in this repository or Vercel. In Google Auth Platform, use the Supabase callback URI shown by the provider configuration. In Supabase URL Configuration, allow both the local callback (`http://localhost:3000/auth/callback`, plus `127.0.0.1` if used) and the production callback (`https://<your-vercel-domain>/auth/callback`). See the official [Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google) and [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls).

The application stores private Guided Ravi runs and Laboratory sessions in Supabase. The authenticated Data API and database RLS both enforce the owner boundary. The `e2e` service uses a digest-pinned Playwright image, the private Compose network, the shared dependency volume, a read-only repository mount, and no published port.

The default E2E run always verifies the public landing page and unauthenticated redirects. Private Guided Ravi and Laboratory journeys require an ignored Playwright storage-state file from a test account:

```bash
E2E_AUTH_STORAGE_STATE=.auth/user.json docker compose run --rm e2e
```

Never commit `.auth/`; it can contain live Supabase session tokens.

## Delivered milestones

1. Docker sandbox and repository/test harness
2. Domain types and Ravi fixtures
3. R001 and deterministic health engine
4. Resolution, simulated correction, revalidation, and audit events
5. Validated API and polished end-to-end Case File UI
6. Accessibility, responsive, privacy, security, and submission hardening
7. Supabase Google OAuth and durable private history

Optional bounded AI remains deferred because it is not needed for the complete deterministic journey. Vercel is the intended public deployment target; project creation and environment assignment remain account-owner actions.

See [`docs/product/DEMO.md`](docs/product/DEMO.md) for the three-minute presentation path.
# Product routes

- `/` — choose Guided Ravi or PF Record Laboratory.
- `/guided-ravi` — frozen deterministic 4/5 → 5/5 tutorial.
- `/laboratory` — construct and assess strict synthetic PF histories.
- `/login` — Google OAuth sign-in through Supabase.
- `/history` — private Guided Ravi and Laboratory history.
