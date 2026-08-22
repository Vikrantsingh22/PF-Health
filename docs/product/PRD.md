# PF Health Product Requirements

## 1. Product overview

PF Health identifies supported conditions in a synthetic PF record that may interfere with a future workflow. It explains the condition in plain language, identifies who should act next, guides a supported corrective action, and revalidates the record afterward.

PF Health is an independent educational prototype, not an EPFO service.

## 2. User problem

PF records contain administrative dependencies that many employees discover only when attempting a transfer or claim. Government terminology, unclear ownership, and fragmented correction paths make problems difficult to understand and act on. The product makes a small, evidence-backed subset of those dependencies visible earlier.

## 3. Primary persona

An early-career salaried employee who has changed jobs, has limited knowledge of PF administration, primarily uses a mobile phone, and wants to understand whether their record needs attention before a future workflow.

## 4. Product thesis

Early, explainable, evidence-backed record checks can help a member understand and address known administrative conditions before a high-pressure transaction. Trust comes from deterministic rules, explicit limits, provenance, and clear ownership—not from an unconstrained chatbot.

## 5. Main journey

`DETECT → EXPLAIN → ASSIGN OWNER → RESOLVE → REVALIDATE`

The product loads a synthetic member snapshot, runs deterministic checks, summarizes the result, lets the user inspect an issue and its evidence, offers only supported actions, simulates a correction, reruns the same checks, and records an audit trail.

## 6. Primary demo case

Ravi Sharma has a previous employment record with no exit date and reason. Under the supported synthetic transfer scenario, PF Health must:

1. detect `MISSING_PREVIOUS_EMPLOYMENT_EXIT` through R001;
2. explain that exit information is required for the supported online-transfer scenario;
3. show the next actor and available paths without assigning blame;
4. generate or display a correction request using approved facts;
5. simulate the correction locally;
6. rerun all checks automatically;
7. move from four passing checks to five passing checks;
8. show the events in an audit timeline.

## 7. Functional requirements

### FR-01 Synthetic account loading

Load a known demo member without collecting real identifiers or credentials. The demo can be reset to a deterministic initial state.

### FR-02 Health evaluation

Evaluate a normalized member snapshot with versioned deterministic rules. Every check returns `PASS`, `FAIL`, or `UNKNOWN` and includes provenance.

### FR-03 Health summary

Show overall state, check counts, individual check states, and a clear primary action. Overall state must distinguish `HEALTHY`, `NEEDS_ATTENTION`, and `REVIEW_REQUIRED`.

### FR-04 Issue explanation

For a supported issue, show what needs attention, why it may matter, affected supported workflows, who needs to act, what to do next, and why PF Health is saying it.

### FR-05 Resolution ownership

Use the issue taxonomy to identify a default owner, fallback owner, and supported resolution actions. Do not infer ownership with an LLM.

### FR-06 Correction drafting

Provide deterministic template copy and optionally an AI-generated draft. Generated text must use only supplied synthetic facts, be validated, be editable, and have no authority over state.

### FR-07 Simulated correction

Allow only an explicitly supported demo correction. Clearly label it as a simulation that changes local synthetic data only.

### FR-08 Revalidation

Automatically rerun the same rule set after correction and show what changed.

### FR-09 Audit timeline

Record account load, assessment, resolution start, synthetic mutation, and revalidation as ordered append-only events.

### FR-10 Evidence and limitations

Expose source IDs and a concise limitation for each implemented rule. Never present an unsupported claim as authoritative.

## 8. Non-functional requirements

- Mobile-first and usable at 375px, 768px, and 1440px widths.
- Keyboard operable, screen-reader understandable, and not dependent on color alone.
- Deterministic hero flow reproducible from a reset state.
- No real personal, government, bank, employer, or credential data.
- Fast local feedback through tests, typecheck, lint, and build checks.
- AI-disabled mode retains the complete deterministic journey.
- Unknown evidence remains visible and actionable.
- User-facing status changes are auditable.

## 9. MVP

- One synthetic member and before/after fixtures
- Five health-check rows, with R001 as the only failing rule in the hero case
- One fully supported issue and resolution path
- Health summary, issue detail, resolution, revalidation, healthy, and timeline states
- Deterministic fallback copy
- Unit, application, component, and one E2E hero-flow test

Any placeholder check included to achieve the five-check presentation must be backed by explicit synthetic facts, be clearly documented, and not introduce an unsupported PF rule. Prefer simple record-completeness checks over legal or eligibility assertions.

## 10. Out of scope

Real EPFO integration, claim submission, automated portal interaction, credential handling, broad eligibility decisions, financial advice, employer dashboards, generic chat, pension calculations, withdrawal routing, semantic service routing, multiple government services, and production identity verification.

## 11. Success criteria

- A fresh demo reset always produces the same one-issue assessment.
- The supported correction always produces a healthy reassessment without AI.
- Viewers can explain the problem, impact, owner, action, and evidence after one pass through the flow.
- No UI or model output can change authoritative health status.
- The three-minute demo works locally without network access, except optional AI enhancement.
- All implemented domain claims reference approved sources.

## 12. Mocked versus functional

Functional: normalization, deterministic evaluation, issue construction, ownership mapping, allowed-action validation, local mutation, revalidation, audit history, UI state handling, and tests.

Mocked/simulated: member data, EPFO adapter, employers, correction submission, approval, documents, timelines, and all external systems.

Optional enhancement: AI explanation and request drafting. Deterministic copy must remain available.

## 13. Known limitations

- The prototype supports a deliberately narrow subset of PF record conditions.
- A healthy result means only that no known blockers were detected by supported checks.
- Real correction ownership and procedure can vary by member state, evidence, portal capability, employer, and current EPFO policy.
- The synthetic correction does not demonstrate that an actual EPFO record can or will be changed.
- Rules and sources require review before use beyond the demo.
