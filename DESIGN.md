---
name: PF Health
description: A calm, trustworthy case-file experience for a synthetic PF record journey.
colors:
  warm-paper: "#f7f4ed"
  raised-paper: "#fffdf8"
  slate-ink: "#102033"
  muted-slate: "#5b6878"
  quiet-line: "#c9c3b8"
  trustworthy-blue: "#0c4b91"
  deep-blue: "#07386d"
  blue-wash: "#eaf2fb"
  healthy-green: "#237a42"
  healthy-wash: "#edf7ef"
  attention-amber: "#a55e00"
  attention-wash: "#fff7e8"
  review-violet: "#5d4b76"
  review-wash: "#f2eff8"
  danger: "#a33a31"
  focus-blue: "#006bd6"
  on-accent: "#fff"
typography:
  display:
    fontFamily: "Noto Sans Variable, Noto Sans, sans-serif"
    fontSize: "clamp(2.2rem, 9vw, 3.65rem)"
    fontWeight: 740
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Noto Sans Variable, Noto Sans, sans-serif"
    fontSize: "clamp(1.5rem, 6.5vw, 2.25rem)"
    fontWeight: 720
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Noto Sans Variable, Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans Variable, Noto Sans, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 650
    lineHeight: 1.35
rounded:
  control: "10px"
  card: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.trustworthy-blue}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
    height: "52px"
  case-file:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.card}"
    padding: "52px 24px 26px"
---

# Design System: PF Health

## Overview

**Creative North Star: "The Calm Case File"**

PF Health feels like a carefully organized personal record: warm, legible, and operational rather than official or bureaucratic. The interface reveals one result, one issue, its owner, and its evidence in that order. It stays consumer-friendly without imitating EPFO or a government portal.

**Key Characteristics:**

- Warm paper surfaces with deep-blue file geometry.
- Stable before-and-after layouts for direct 4/5 to 5/5 comparison.
- Plain-language status paired with authored outline icons and text.
- Progressive evidence disclosure and one primary decision per state.

## Colors

The palette uses warm neutrals as the ground, near-black slate for legibility, and a scarce deep blue for trust and orientation. Green, amber, violet, and red are semantic only; every status also has text and an icon.

**The Evidence Before Accent Rule.** Color guides attention, but source-backed language establishes meaning.

**The Status Has Two Signals Rule.** Never communicate health, attention, or review state by color alone.

## Typography

**Display and Body Font:** Noto Sans Variable, with Noto Sans and generic sans-serif fallbacks.

**Character:** Open, highly legible forms support dense record language and future Indian-language expansion without changing visual voice.

### Hierarchy

- **Display** (740, responsive 2.2–3.65rem, 1.06): health score and primary result.
- **Headline** (720, responsive 1.5–2.25rem, 1.12): issue and state headings.
- **Body** (400, 1rem, 1.5): explanations and instructions, generally constrained to 48–61 characters.
- **Label** (650, 0.82rem, 1.35): check status, field labels, and compact metadata.

**The Plain Language First Rule.** Explain the record in everyday language before introducing rule identifiers or evidence metadata.

## Layout

The journey is a centered single column. The shell uses 16px horizontal padding on mobile, 24px from 640px, and 32px from 1024px; its readable maximum is 860px. Spacing follows a 4px rhythm with preferred steps of 4, 8, 12, 16, 24, 32, 48, and 64px. The layout remains single-column at 375px, 768px, and 1440px so the before-and-after comparison never changes mental model.

**The One Active Decision Rule.** Each screen or action region presents one unmistakable primary action.

## Elevation & Depth

Persistent surfaces are flat and use tonal contrast, one-pixel borders, spacing, and overlapping file geometry instead of shadows. The deep-blue right tab, top file tab, and solid stepped bridge create structural depth without making content float.

**The Flat Record Rule.** Shadows are not used for persistent content; structure comes from borders, layers, and silhouette.

## Shapes

Cards and dossiers use practical 16px corners; buttons use 10px corners. Status icons are circular, guidance icons sit in softly squared 48px tiles, and the case-file silhouette combines a rounded top tab, a deep-blue right tab, and a solid stepped connector into the issue dossier.

## Components

### Buttons

- **Primary:** full-width trustworthy blue, white text, 52px minimum height, and 14px by 20px padding.
- **Secondary / Ghost:** bordered or transparent deep-blue alternatives, never competing with the primary action.
- **States:** color and small-position transitions use the established 180ms ease-out curve; focus uses a visible 3px focus-blue outline. Reduced motion removes transitions and hover translation while preserving immediate state change.

### Case File

The raised-paper summary contains the record name, health score, five fixed check rows, and a prominent deep-blue side tab. Check rows preserve stable order and pair icon, text, and semantic tint.

### Issue Dossier

The dossier uses an amber border, solid stepped bridge, issue dot, route and owner guidance tiles, and a native details disclosure for evidence. The healthy variant keeps the structure and changes the semantic treatment to green.

### Status Panels and Timeline

Loading, confirmation, revalidation, error, and timeline states reuse one bordered raised-paper panel. The timeline is append-only in reading order and uses a restrained line-and-dot sequence.

## Do's and Don'ts

### Do:

- **Do** preserve the same five-row information architecture before and after revalidation.
- **Do** pair every status color with text and an authored icon.
- **Do** keep evidence, limitations, and synthetic/non-affiliation disclosure visible in the journey.
- **Do** maintain 44px minimum interactive targets, visible focus, and targeted reduced-motion alternatives.

### Don't:

- **Don't** imitate an EPFO or government portal or imply official affiliation.
- **Don't** add dashboard density, chatbot bubbles, decorative charts, gradients, shadows, or celebratory gamification.
- **Don't** present unknown or review-required outcomes as healthy.
- **Don't** replace the solid file-to-dossier bridge with a dashed connector.
