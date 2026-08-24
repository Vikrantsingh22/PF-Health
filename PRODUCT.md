# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is an Indian salaried employee who wants to understand whether a PF record needs attention before a future transfer. The MVP demonstrates this job through Ravi Sharma, a fictional member using a synthetic record. Users are not expected to understand EPFO abbreviations or administrative terminology.

## Product Purpose

PF Health detects a small, explicitly supported set of PF-record conditions early, explains what is known and uncertain in plain language, identifies the next actor, supports a simulated correction, and automatically revalidates the record. MVP success means a user can understand and complete Ravi's one supported journey in under three minutes without developer guidance.

## Positioning

PF Health combines deterministic, source-backed record checks with a complete explain → assign owner → resolve → revalidate journey. Generated copy may assist communication, but it cannot determine health, ownership, available actions, or mutations.

## Operating Context

The MVP is a mobile-first hackathon prototype used as a guided single-member workflow. It starts with a synthetic sample, shows five deterministic checks, explains one missing-exit-information issue, confirms an exact local-only correction, reruns the same checks, and exposes a safe audit timeline.

## Capabilities and Constraints

- The only MVP persona is synthetic Ravi Sharma.
- The only PF workflow rule is `R001@1`: missing exit information on an unambiguous previous employment.
- The canonical journey is `DETECT → EXPLAIN → ASSIGN OWNER → RESOLVE → REVALIDATE`.
- The product does not connect to EPFO or any government system and does not submit claims, transfers, corrections, credentials, or identifiers.
- No real UAN, Aadhaar, PAN, bank, OTP, employer, claim, or government-account data is accepted or displayed.
- Deterministic rules own health state. AI is optional, non-authoritative, and outside the required UI milestone.
- `UNKNOWN` and `REVIEW_REQUIRED` remain distinct from healthy or needs-attention.
- All installation, execution, tests, builds, state commands, and design-detector commands run in the repository's Docker sandbox.

## Brand Commitments

The product name is PF Health. The voice is calm, direct, respectful, specific, and honest about limitations. The interface must feel trustworthy and contemporary without resembling a government portal clone, generic dashboard, chatbot, crypto product, or neon fintech landing page. Every screen keeps the synthetic-data and independent-prototype boundary clear.

## Evidence on Hand

- Immutable Ravi before/after fixtures and deterministic 4/5 → 5/5 test oracles.
- Versioned R001 rule, closed issue taxonomy, and official-source register under `docs/domain/`.
- Approved product copy and limitations under `docs/design/COPY.md`.
- Product, architecture, API, security, testing, and demo contracts under `docs/`.
- No customer testimonials, production member data, government affiliation, usage benchmarks, or outcome guarantees exist and none may be fabricated.

## Product Principles

1. Explain the member's record before administrative terminology.
2. Show deterministic evidence and uncertainty before asking for action.
3. Keep one clear primary action at each stage of the journey.
4. Make simulation boundaries and the before/after change unmistakable.
5. Prefer a reliable, resettable hero path over broader unsupported scope.

## Accessibility & Inclusion

Target WCAG 2.2 AA. The complete flow must work at a 375px viewport, with semantic HTML, keyboard navigation, visible focus, descriptive controls, touch targets of at least 44×44px where practical, reduced-motion support, and status communicated through text plus shape or icon rather than color alone.
