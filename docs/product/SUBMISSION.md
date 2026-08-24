# PF Health Submission Brief

## One-line pitch

PF Health is an independent synthetic-data prototype that finds a supported PF record concern early, explains it with evidence, guides a simulated correction, and revalidates the same record.

## The three-minute story

Ravi's fictional record starts with four of five supported checks healthy. The one attention item is missing previous-employment exit information for the narrowly stated online-transfer scenario. PF Health explains why that may matter, identifies the supported next path, shows official-source provenance, asks for explicit confirmation, updates only the synthetic sample, reruns the same deterministic checks, and ends at five of five with an audit timeline.

## What is real and what is simulated

| Capability | Status | Boundary |
| --- | --- | --- |
| Record normalization, five checks, R001 result | Functional | Deterministic and versioned |
| Issue explanation, ownership, source display | Functional | Approved static copy and taxonomy |
| Confirmation, stale-state/replay protection | Functional | Process-local application service |
| Correction, EPFO adapter, member record | Simulated | Ravi-only synthetic data |
| Revalidation and audit timeline | Functional | Same deterministic engine after mutation |
| AI generation | Not included | Complete journey uses no model or key |
| EPFO login, scraping, submission, claim decision | Not available | Explicitly outside scope |

## Architecture

The app is a modular monolith. React/Next.js UI and strict route handlers call application services; services coordinate the deterministic health engine, resolution lifecycle, audit history, and replaceable ports; domain rules remain framework- and network-independent. The only external-system adapter is a Ravi-only mock that performs no government requests.

See the [architecture visual](../finalist/architecture.svg) and [full architecture](../../ARCHITECTURE.md).

## Trust and limitations

- PF Health is unofficial and not affiliated with EPFO or any government body.
- It accepts no real UAN, Aadhaar, PAN, bank, OTP, credential, or member-portal data.
- `HEALTHY` means only that the five prototype checks found no known concern.
- R001 applies only to the named supported scenario and is not a universal eligibility decision.
- The synthetic correction proves application behavior, not that a real record can or will be changed.
- Rule sources and procedures require review before any use beyond this demonstration.

## Reproduce the submission

From the `pf-health` repository root, with Docker running:

```bash
docker compose run --rm app npm run verify:submission
docker compose run --rm --no-deps app npm run check
docker compose run --rm e2e
docker compose run --rm app npm run reset:demo
docker compose up app
```

Open `http://127.0.0.1:3000`. Stop this project with `docker compose down`.

## Release evidence checklist

- [x] Deterministic 4/5 → 5/5 hero journey
- [x] Reset command and automated acceptance tests
- [x] 375px, 768px, and 1440px responsive coverage
- [x] Keyboard, reduced-motion, and non-color status coverage
- [x] Security headers and prohibited-data release scan
- [x] Docker-only lint, typecheck, test, build, and browser testing
- [x] Official source provenance and limitations
- [ ] Public deployment and incognito verification
- [ ] Final release tag and submission-form confirmation

The unchecked items require a selected hosting platform/account and the final competition submission destination. They are not implied by a local build.

## Judge-facing description

PF Health turns one confusing administrative condition into a transparent, testable journey. Instead of asking an AI to decide eligibility, it uses a small versioned rule set to assess a fictional record, exposes the supporting EPFO material and limitation, permits only an explicit synthetic correction, and reruns the same checks afterward. The result is intentionally narrow: one polished case that demonstrates explainability, safe action ownership, revalidation, and auditability without collecting personal data or connecting to a government system.
