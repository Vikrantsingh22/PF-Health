# PF Health Design System

This document defines implementation-level visual defaults. Use design tokens rather than scattered literal values. Exact font availability may be finalized during frontend bootstrap without changing hierarchy.

## Foundations

### Color roles

Use semantic tokens, not color names, in components:

- `surface`: warm white
- `surface-subtle`: light neutral
- `text`: near-black slate
- `text-muted`: accessible mid-slate
- `border`: quiet neutral border
- `accent`: deep trustworthy blue
- `pass`: green with dark text on a pale tint
- `attention`: amber with dark text on a pale tint
- `blocker`: red with dark text on a pale tint
- `unknown`: neutral violet/slate with dark text on a pale tint

All combinations must meet AA contrast. Status always includes text and an icon.

### Typography

Prefer a highly legible system or locally bundled sans-serif with Indian-language support.

| Role | Mobile | Desktop | Weight |
| --- | --- | --- | --- |
| Display/page title | 28/34 | 32/38 | 650–700 |
| Section title | 20/28 | 20/28 | 600–650 |
| Card title | 17/24 | 18/26 | 600 |
| Body | 16/24 | 16/24 | 400 |
| Secondary | 14/20 | 14/20 | 400 |
| Label | 13/18 | 13/18 | 600 |

Use sentence case. Avoid all caps except compact technical IDs in developer-only views.

### Spacing

Base unit: 4px. Preferred scale: `4, 8, 12, 16, 24, 32, 48, 64`.

- Page horizontal padding: 16px mobile, 24px tablet, 32px desktop.
- Card padding: 16px mobile, 20–24px desktop.
- Section gap: 32px mobile, 40–48px desktop.
- Keep related label/value pairs within 8px.

### Radius and borders

- Cards and dialogs: 16px
- Buttons and inputs: 10px
- Small controls: 8px
- Badges: full/pill radius
- Border: 1px neutral by default
- Shadows: none or a single very subtle elevation for overlays only

## Components

### Buttons

- **Primary:** one per action region; filled accent.
- **Secondary:** bordered surface for alternate safe actions.
- **Ghost:** low-emphasis navigation or disclosure.
- **Danger:** destructive/reset confirmation only.

Buttons have default, hover, focus-visible, active, disabled, and loading states. Loading labels remain meaningful, such as **Rechecking record…**.

### Inputs

Labels are always visible. Help and error text are associated programmatically. The MVP should minimize data entry and never request real member identifiers.

### Cards

- `summary`: overall state and score
- `issue`: one known condition and primary CTA
- `check`: compact deterministic result
- `owner`: actor and next responsibility
- `evidence`: source and limitation
- `timeline`: ordered audit event

Cards group content; they are not used as decoration around every paragraph.

### Status indicator

Contains icon, label, and optional short explanation. Supported variants: `pass`, `attention`, `blocker`, and `unknown`.

### Page shell

Includes product name, independent-prototype label, main landmark, and optional compact step context. Do not add a complex global navigation for the MVP.

## Responsive behavior

- `< 640px`: single column, full-width primary buttons, no context rail.
- `640–1023px`: centered single column; inline button groups where space permits.
- `≥ 1024px`: workflow column plus optional 280–320px evidence rail.
- Test explicitly at 375px, 768px, and 1440px.

## Motion

Use 150–250ms transitions for opacity, color, and small position changes. Avoid auto-playing large motion. For reduced motion, remove transforms and retain immediate state clarity.
