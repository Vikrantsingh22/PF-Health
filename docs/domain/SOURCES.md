# PF Health Source Register

## Evidence policy

Use official EPFO or other directly responsible government sources for authoritative domain rules. Secondary articles may help discovery but cannot authorize a rule. Record the retrieval date, exact use, interpretation, and limitation. Recheck sources before production use or when policy may have changed.

The active R001 sources were rechecked on `2026-08-25`. Retrieval dates are recorded per source.

## SRC-001 — EPFO FAQ: transfer claims

**Title:** FAQ — Transfer Claims
**Publisher:** Employees' Provident Fund Organisation
**Official URL:** https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2020-2021/faq_transfer_claim.pdf
**Retrieved:** 2026-08-22; direct URL rechecked 2026-08-25
**Used by:** `R001`

**Relevant evidence:** The FAQ states that the previous employment's date of exit is mandatory for applying for an online transfer. It describes timing and Aadhaar/OTP prerequisites for the member mark-exit facility and provides the member-portal steps.

**PF Health interpretation:** Missing previous-employment exit information is a supported record-health concern for the named online-transfer scenario. The demo may describe the member self-service path only with its prerequisites and alternatives.

**Limitations:** This does not establish that every missing exit field blocks every transfer route, claim, or settlement. It does not prove that a particular member can use self-service or that a submitted correction will be accepted.

## SRC-002 — EPFO Help: transfer claims

**Title:** EPFO Help
**Publisher:** Employees' Provident Fund Organisation
**Official URL:** https://www.epfindia.gov.in/site_en/Help.php
**Retrieved:** 2026-08-25
**Used by:** `R001` source discovery and user-facing corroboration

**Relevant evidence:** The Help page lists the official “Transfer Claims for Employees” FAQ. The linked transfer-claims PDF is the direct rule authority recorded as SRC-001.

**PF Health interpretation:** Use this page to help a reviewer find EPFO's transfer-claim materials. Do not treat the listing itself as independent authority for R001.

**Limitations:** EPFO's previously recorded direct FAQ URL returned `404` when rechecked on 2026-08-25, despite current search indexing of the FAQ content. The app therefore links to the working Help page and the directly reachable SRC-001 PDF. Recheck link routing and rule content before any use beyond this prototype.

## SRC-003 — Joint Declaration SOP

**Title:** Standard Operating Procedure — Joint Declaration
**Publisher:** Employees' Provident Fund Organisation
**Official URL:** https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2023-2024/SOP_WSU_26032024.pdf
**Retrieved:** 2026-08-22
**Used by:** research context only; no active MVP rule

**Relevant evidence:** The SOP discusses profile incompleteness/mismatches and processes for member profile correction, including dates/reasons of leaving among the listed parameters.

**PF Health interpretation:** This supports the general product problem and future correction-path research, not an automatic issue or owner decision.

**Limitations:** The procedure contains classifications, evidence requirements, and approval paths that the MVP does not model. Do not derive a rule from a paragraph in isolation.

## SRC-004 — Aadhaar seeding/correction circular

**Title:** Seeding/Correcting Aadhaar in UAN
**Publisher:** Employees' Provident Fund Organisation
**Official URL:** https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/Seeding_Correcting%20AadhaarIn_UAN.pdf
**Retrieved:** 2026-08-22
**Used by:** future identity-mismatch research only

**Relevant evidence:** The circular describes routes for Aadhaar seeding or correction depending on whether name, gender, and date of birth match and whether Aadhaar is already verified.

**PF Health interpretation:** A future identity rule would need state-specific routing rather than a single generic “employer fixes it” action.

**Limitations:** No identity/KYC rule is approved for the MVP. Never collect real Aadhaar information.

## Source maintenance

When a rule changes or a source is refreshed:

1. preserve the old rule version in historical assessments;
2. update retrieval date and summarize the change;
3. review rule condition, owner, actions, copy, tests, and API examples;
4. prefer `UNKNOWN`/`REVIEW_REQUIRED` while evidence conflicts;
5. never copy personal examples or identifiers from source material into fixtures.
