<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->
---
name: PF Health
description: A calm, trustworthy record-checking experience for a synthetic PF journey.
---

# Design System: PF Health

## Overview

**Creative North Star: "The Calm Case File"**

PF Health should feel like a well-organized personal case file: clear enough to scan quickly, careful enough to trust, and restrained enough that evidence remains more important than decoration. The interface is contemporary and consumer-friendly without imitating an official government portal.

The visual rhythm is deliberate and operational. One issue, one owner, one next action, and the supporting evidence are revealed in that order. Status changes remain comparable in place, especially the transition from four healthy checks to five. The system rejects dashboard density, chatbot styling, neon technology aesthetics, and celebratory gamification.

**Key Characteristics:**

- Warm, quiet surfaces with a single trustworthy accent.
- Mobile-first, single-column reading with evidence disclosed progressively.
- Plain-language status reinforced by icon and shape, never color alone.
- Stable layouts that make before-and-after changes easy to compare.
- Restrained motion and no decorative data visualization.

## Colors

Use a warm neutral foundation, near-black slate text, quiet borders, and one deep blue accent. Semantic status tints support meaning but never carry it alone. Exact accessible values will be resolved during implementation and captured by the first scan-mode documentation pass.

### Primary

- **Trustworthy Deep Blue** ([to be resolved during implementation]): Primary actions, active focus, and selective orientation cues.

### Neutral

- **Warm Paper** ([to be resolved during implementation]): Main page surface.
- **Quiet Wash** ([to be resolved during implementation]): Grouped or secondary surfaces.
- **Near-Black Slate** ([to be resolved during implementation]): Primary text.
- **Accessible Mid-Slate** ([to be resolved during implementation]): Secondary text.
- **Quiet Border** ([to be resolved during implementation]): Structural separation.

### Named Rules

**The Evidence Before Accent Rule.** Color may guide attention, but hierarchy and source-backed language must establish meaning first.

**The Status Has Two Signals Rule.** Every status pairs text with an icon or shape; color is always supplementary.

## Typography

Use one highly legible humanist sans-serif family with open forms and Indian-language support. The exact locally available or bundled family will be resolved during implementation; avoid generic Arial, fashionable display faces, and mixed-family ornament.

### Hierarchy

- **Display** (650–700, 28/34 mobile and 32/38 desktop): Page-level result and the main health count.
- **Headline** (600–650, 20/28): Section and step headings.
- **Title** (600, 17/24 mobile and 18/26 desktop): Card and issue titles.
- **Body** (400, 16/24): Core explanation and instructions; keep lines within a comfortable reading measure.
- **Secondary** (400, 14/20): Supporting context and limitations.
- **Label** (600, 13/18): Compact status, owner, and field labels in sentence case.

### Named Rules

**The Plain Language First Rule.** Explain the record in everyday language before introducing administrative terms or evidence details.

## Layout

The complete journey is a single-column flow at 375px. Use a centered workflow measure of 640–760px, with page padding of 16px on mobile, 24px on tablet, and 32px on desktop. At 1024px and above, an optional 280–320px evidence rail may accompany the workflow when it improves comparison; it must collapse into the main reading order on smaller screens.

Spacing follows a 4px base rhythm with preferred steps of 4, 8, 12, 16, 24, 32, 48, and 64px. Keep actions close to the content they affect. Avoid persistent sidebars, dashboard grids, and card-wrapping every paragraph.

**The One Active Decision Rule.** Each screen or action region presents one unmistakable primary action.

## Elevation & Depth

PF Health is flat by default. Tonal surfaces, borders, spacing, and disclosure establish depth. Shadows are reserved for temporary overlays and remain subtle.

**The Flat Record Rule.** Persistent content does not float; hierarchy comes from structure, not stacked shadows.

## Shapes

The form language is gently rounded and practical: 16px for cards and dialogs, 10px for buttons and inputs, 8px for small controls, and pill shapes only for compact status badges. A quiet 1px border separates persistent surfaces.

## Do's and Don'ts

### Do:

- **Do** preserve the same information architecture before and after revalidation so the changed check is obvious.
- **Do** keep touch targets at least 44×44px where practical and expose visible keyboard focus.
- **Do** use progressive disclosure for evidence, rule identifiers, and limitations.
- **Do** use calm, direct, specific copy for Ravi's synthetic sample record.

### Don't:

- **Don't** imitate an EPFO or government portal or imply official affiliation.
- **Don't** use chatbot bubbles, open-ended prompt boxes, crypto-dashboard styling, neon gradients, or decorative charts.
- **Don't** celebrate a healthy state with confetti, gamification, or exaggerated motion.
- **Don't** present unknown or review-required states as healthy.
