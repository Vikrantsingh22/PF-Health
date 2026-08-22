# PF Health User Journey

## Persona and scenario

Ravi Sharma is a fictional salaried employee who recently changed jobs. He wants to know whether his synthetic PF record needs attention before a future transfer. He is not expected to understand terms such as DOE, MID, or KYC.

## Journey principles

- Start with the member's goal, not government terminology.
- One primary action per screen.
- Explain before asking the member to act.
- Identify responsibility without blame.
- Keep uncertainty visible.
- Label every simulated action before confirmation.
- Make the before/after change unmistakable.

## End-to-end flow

### 1. Welcome

Ravi sees the independent-prototype disclaimer and a single action: **Check Ravi's sample record**. No login, identifier, OTP, or data entry is requested.

### 2. Loading and evaluation

The product loads a local synthetic snapshot and runs all supported deterministic checks. The UI announces progress without implying a live EPFO connection.

Failure state: explain that the sample could not be loaded and offer **Reset sample** or **Try again**. Never show a blank dashboard.

### 3. Health summary

Ravi sees **4 of 5 checks look healthy** and **1 needs attention**. The issue card says: **Your previous employment is missing exit information.** The primary action is **Review this issue**.

An `UNKNOWN` check is shown separately as **We could not confirm this check**; it is never counted as healthy.

### 4. Issue detail

The content order is fixed:

1. What needs attention
2. Why this matters
3. Who needs to act
4. What to do next
5. Why we're saying this

The issue explains the supported online-transfer impact and links it to source `SRC-001`. It avoids claiming that every transfer or claim will fail.

### 5. Resolution choice

Ravi sees the supported path for the demo and any fallback requiring review. He may copy or generate a correction request. The model, if enabled, drafts text only; it cannot select the owner or action.

Primary action: **Continue with simulated correction**.

### 6. Simulation confirmation

Before mutation, the product states: **This updates only Ravi's sample record. Nothing will be sent to EPFO or an employer.** The confirmation names the exact fields that will change.

### 7. Revalidation

After confirmation, the application applies the local correction, appends an audit event, and automatically reruns the same rules. A visible progress state prevents an unexplained jump.

### 8. Healthy result

Ravi sees **5 of 5 supported checks look healthy** and the wording: **No known blockers were detected by the checks supported in this prototype.** The UI highlights the corrected employment record and offers **View timeline** and **Reset demo**.

### 9. Audit timeline

The timeline shows sample loaded, assessment completed, issue reviewed, simulated correction applied, and revalidation completed. It distinguishes user actions from system evaluations.

## Alternate paths

- Missing or malformed fixture: recoverable error with reset.
- Insufficient evidence: `REVIEW_REQUIRED` guidance; no simulated correction unless explicitly allowed.
- Stale member version: conflict message and reload; never overwrite silently.
- AI unavailable or invalid: show deterministic approved copy and continue.
- User cancels correction: preserve state and return to issue detail.

## Accessibility expectations

Focus moves to the new page heading after navigation. Status includes icon and text. Dynamic reassessment is announced through an appropriate live region. Buttons describe actions, not vague labels such as **Submit** or **Proceed**.
