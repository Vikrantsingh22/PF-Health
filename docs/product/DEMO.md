# PF Health Demo Runbook

## Objective

Demonstrate one trustworthy transition in under three minutes:

`4/5 healthy → explain one known issue → simulate correction → 5/5 healthy`

## Pre-demo checklist

- Run `docker compose run --rm app npm run verify:submission`.
- Run `docker compose run --rm --no-deps app npm run check`.
- Run `docker compose run --rm app npm run reset:demo` and confirm the expected initial assessment.
- Run `docker compose run --rm e2e` after any UI change.
- Confirm the app makes no optional AI or government-system calls.
- Open the app at the welcome screen.
- Confirm 375px and presentation-width layouts.
- Keep a recorded or screenshot fallback only as presentation backup.

## Script

### 0:00–0:25 — Problem

“PF issues are often discovered when someone is already trying to transfer or claim. PF Health checks a synthetic record earlier and explains supported concerns in plain language.”

Click **Load Ravi's sample record**.

### 0:25–0:55 — Detect

Show **4 of 5 checks look healthy** and open **Your previous employment is missing exit information**.

State that the result comes from a deterministic, versioned rule—not an LLM.

### 0:55–1:35 — Explain and assign

Show what needs attention, the narrow online-transfer impact, the next actor/path, and **Why we're saying this** with the official EPFO source. Emphasize uncertainty and the absence of a success guarantee.

### 1:35–2:05 — Resolve

Show the exact proposed synthetic change and the simulation notice. Confirm that only Ravi's process-local sample changes; nothing is sent to EPFO or an employer.

### 2:05–2:35 — Revalidate

Apply the simulated correction. Let automatic revalidation complete. Show **5 of 5 supported checks look healthy** and the corrected record field.

### 2:35–3:00 — Trust

Open the audit timeline. Close with: deterministic status and copy, official-source provenance, no real EPFO data, no government integration, and no outcome guarantee.

## Expected oracle

Before correction:

```json
{
  "status": "NEEDS_ATTENTION",
  "passedChecks": 4,
  "totalChecks": 5,
  "issueCodes": ["MISSING_PREVIOUS_EMPLOYMENT_EXIT"]
}
```

After correction:

```json
{
  "status": "HEALTHY",
  "passedChecks": 5,
  "totalChecks": 5,
  "issueCodes": []
}
```

## Recovery plan

- If a network is unavailable: continue normally; the product flow has no runtime dependency on external services.
- If local state is wrong: run or use **Reset demo**.
- If animation or navigation fails: use direct routes only if those routes are part of the tested build.
- If network is unavailable: the complete hero flow must still work.

Never enter real data or open a real EPFO portal during the demo.
