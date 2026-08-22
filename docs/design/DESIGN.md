# PF Health Visual Direction

## Goal

The interface should feel trustworthy, calm, accessible, contemporary, and suitable for Indian public-service infrastructure while remaining consumer-friendly.

It must not resemble a crypto dashboard, generic AI chatbot, enterprise admin panel, government-portal clone, or neon startup landing page.

## Layout

- Mobile-first, with the complete journey usable at 375px.
- Workflow content width: 640–760px.
- Desktop: centered workflow with an optional narrow evidence/context rail.
- Avoid dense dashboard grids, persistent sidebars, and decorative data visualizations.
- Keep actions close to the content they affect.

## Information hierarchy

Every issue screen prioritizes:

1. What needs attention?
2. Why does it matter?
3. Who needs to act?
4. What should I do next?
5. Why are we saying this?

Plain language precedes terms such as date of exit, UAN, or KYC. Technical and source detail uses progressive disclosure.

## Status model

User-facing labels:

- **Healthy** — a supported check passed.
- **Needs attention** — a supported check found an actionable condition.
- **Blocking** — reserved for a source-backed condition known to block the explicitly named workflow. Do not use for general health.
- **Could not confirm** — evidence is missing or unsupported.
- **Review required** — a person must determine the next step.

Every status uses text plus an icon or shape. Color alone is never sufficient.

## Interaction philosophy

- One primary action per screen or section.
- Progressive disclosure for evidence and administrative detail.
- Explicit confirmation before synthetic mutation.
- Visible progress during evaluation and revalidation.
- Preserve user context after recoverable errors.
- Avoid chat bubbles and open-ended prompt boxes.
- Do not celebrate with confetti or gamified rewards; use a calm, clear healthy transition.

## Core screens

1. Welcome/sample selection
2. Evaluating
3. Health summary
4. Issue detail
5. Resolution and request draft
6. Simulation confirmation
7. Revalidating
8. Healthy result
9. Audit timeline

Each screen must define loading, error, empty, and unknown behavior where applicable.

## Demo priority

The visual centerpiece is the transition from **4 of 5 checks look healthy** to **5 of 5 supported checks look healthy**. Preserve the layout between states so the changed check is easy to compare. Animate subtly and respect `prefers-reduced-motion`.

## Accessibility

- Target WCAG 2.2 AA for color contrast and interaction.
- Use semantic headings, lists, buttons, details, and status regions.
- Maintain visible focus styles and logical focus order.
- Touch targets should be at least 44×44px where practical.
- Do not hide essential content in hover-only interactions.
- Use direct, descriptive action labels.
