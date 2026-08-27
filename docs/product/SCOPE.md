# PF Health Scope

Target: deterministic, demo-ready MVP for the August 27 hackathon checkpoint.

## MUST

- Synthetic account loading and deterministic reset
- Normalization of the Ravi fixture
- Versioned health evaluation with `PASS`, `FAIL`, and `UNKNOWN`
- R001: missing previous-employment exit information
- Health summary and check-level detail
- Plain-language issue explanation and official-source provenance
- Resolution owner and supported next action
- Deterministic correction-request template
- Local simulated correction
- Automatic revalidation and before/after comparison
- Append-only audit timeline
- Loading, error, empty, unknown, issue, resolving, and healthy UI states
- Unit tests and one reliable hero-journey E2E test

## MAYBE — only after MUST is complete

- Hindi translation of approved copy
- One narrowly scoped synthetic-document parser
- AI-enhanced explanation and correction-request drafting
- Low-data mode and offline-friendly demo assets

Each MAYBE item requires explicit human approval before implementation.

## NEVER FOR AUGUST 27

- Real government, Aadhaar, PAN, bank, employer, or EPFO integration
- Real member records, UANs, credentials, OTPs, claims, or documents
- Government-site scraping or browser automation
- Claim or transfer submission
- Generic chatbot or autonomous in-product agent
- Withdrawal or claim router
- Pension, eligibility, tax, or financial calculator
- Employer dashboard
- Semantic service router
- Multiple public services
- Billing or analytics
- Guarantee of claim, transfer, correction, or eligibility outcome

## Change control

Any feature outside `MUST` requires explicit human approval. New PF issue codes additionally require an official source entry, rule specification, taxonomy entry, provenance, tests, and a documented product reason.
# Approved extension: PF Record Laboratory

The laboratory is an approved synthetic-only extension beside the frozen Ravi tutorial. It permits 1–6 generated fictional employments, generated synthetic account groups A–C, workflows `GENERAL_HEALTH` and `TRANSFER`, five presets, versioned JSON scenario import/export, and deterministic `PF_LAB@1` rules R001–R003. It must not accept real identifiers, names, credentials, files other than strict scenario JSON, AI decisions, EPFO connectivity, or external corrections.

# Approved extension: private Supabase history

Passwordless Supabase email OTP authentication and durable user-owned history are explicitly approved for Vercel deployment. Email is the only accepted real personal datum and is managed by Supabase Auth; application tables reference the immutable Auth user UUID and do not duplicate email. The landing page remains public. Guided Ravi, Laboratory, and history require authentication. Users may list and delete only their own runs and sessions. This approval does not permit real PF identifiers, employers, member records, government credentials, analytics, or external corrections.
