---
name: Arkanya Platform
description: Digital Foundry — personal production OS for generating and deploying projects
colors:
  base: "#0a0c10"
  workspace: "#0f1218"
  surface: "#151922"
  elevated: "#1c212c"
  interactive: "#252b38"
  arc: "#4d9fff"
  arc-light: "#a8d4ff"
  arc-deep: "#1a5fbf"
  gold: "#d8a94a"
  gold-light: "#f2cf7e"
  gold-deep: "#8a6220"
  ink-on-brand: "#061018"
  ink-on-gold: "#18130a"
  overlay: "rgba(0,0,0,0.72)"
  hairline: "rgba(255,255,255,0.08)"
  success: "#3dd68c"
  danger: "#f07178"
  warning: "#e0a23c"
  info: "#6d8aa3"
  text: "#e8eaef"
typography:
  display:
    fontFamily: "Unbounded, sans-serif"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontWeight: 400
rounded:
  none: "0"
  sm: "12px"
  md: "16px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.arc}"
    textColor: "{colors.ink-on-brand}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.arc}"
  module:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Design System — Arkanya Platform

## Overview

Arkanya Platform is a **Digital Foundry**: a personal production OS, not a SaaS dashboard. The interface communicates power, speed, precision, and control. Idle states stay calm; generation states become alive through Arc energy, live timings, and pipeline motion.

**Visitor mode:** Operate.  
**Accent strategy:** Restrained — cool neutrals + one system energy (Arc). Gold is logo recall only.  
**Platform:** Adaptive (desktop-primary web; mobile shell must remain operable).

## Colors

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Base | `--color-base` | `#0a0c10` | App chrome, deepest plane |
| Workspace | `--color-workspace` | `#0f1218` | Main content plane |
| Surface | `--color-surface` | `#151922` | Modules |
| Elevated | `--color-elevated` | `#1c212c` | Hover / raised |
| Interactive | `--color-interactive` | `#252b38` | Selected modules |
| Arc (brand) | `--color-arc` / `--color-brand` | `#4d9fff` | Active, selected, generate, focus, Worker live |
| Gold | `--color-gold` | `#d8a94a` | Logo recall only (wordmark, identity hairlines) |
| Success | `--color-success` | `#3dd68c` | Complete / READY |
| Danger | `--color-danger` | `#f07178` | Error interrupt |
| Warning | `--color-warning` | `#e0a23c` | Validation tension |

Arc is scarce by design. Gold never owns primary CTAs.

## Typography

- **Display:** Unbounded (`.heading`) — architectural titles (`BUILD`, `READY`, page names). Tight tracking, strong scale contrast.
- **Body:** Geist — ops UI copy.
- **Mono / metrics:** Geist Mono (`.metric`) — timings, IDs, status codes, logs, counts. Tabular nums.

Page headers: tiny uppercase metric code → huge display title → short support line.

## Layout

- Desktop-primary continuous workspaces; avoid centered narrow SaaS columns when density allows.
- Overview: three-column production pipeline (QUEUE / BUILD / CHECK) as adjacent surfaces, not card stacks.
- Projects: list rows with progressive disclosure, not card grids.
- Builder: pipeline chrome + module form; execution expands into a live production console.
- Mobile: recompose (bottom nav + elevated Builder CTA); touch targets ≥44px.

## Elevation & Depth

Depth comes from **luminance steps**, not glass stacks. Borders are rare and quiet (`white/[0.04–0.08]`). Selected modules gain surface step + Arc edge light. Background may hold a near-imperceptible coordinate field + grain + cool/gold radials.

Light = information: processing pulses Arc; success stabilizes; idle stays quiet.

## Shapes

- Default radius: **4px** modules/inputs/buttons; **2px** chips/selects.
- Faceted clip-path reserved for the mobile Builder signature action.
- Avoid pill clusters and large SaaS card radii.

## Components — Soft Instrument

Rounded, floating dashboard language (refs: soft dark fintech dashboards). Soft geometry, Arc energy, gold identity.

| Primitive | Class | Role |
|-----------|-------|------|
| Panel | `.chassis` / `.card` / `.module` | Soft 16px cards, subtle elevation |
| Active | `.card-active` | Soft Arc bloom + pill rail |
| Well | `.well` | Soft recessed inputs (12px) |
| Slab | `.slab` / `.fill-identity` | Pill CTA — Arc gradient + gold ring |
| Segment | `.segment-group` + `.segment` | Pill switch |
| Label | `.field-label` | Mono uppercase field labels |

Nav active = soft Arc pill. Overview = metric strip + 3 soft kanban columns. Builder = viewport-locked, no page scroll.

- **Status:** `.status-dot` + typography + motion; never color alone.
- **Progress:** `.progress-shimmer` / `.pipeline-energy` (Arc→gold travel during generation only).
- **Nav:** Arc rail + gold tip on active item; Worker chassis readout.

### Signature moments

1. Project open → name becomes architectural anchor + status codes.
2. Generation start → calm → live production (pulse, ms counter, energy line).
3. Complete → movement stops → **READY** (no confetti); gold may appear as quiet identity recall.

## Do's and Don'ts

**Do**
- Treat projects as living production objects.
- Spend Arc only on activity and focus.
- Use mono for every technical metric.
- Keep French terse ops voice.

**Don't**
- Build card grids of same-size SaaS tiles.
- Flood gold or neon glow.
- Use purple AI gradients, cyberpunk, Matrix terminals, confetti.
- Redesign IA/routes for visual novelty.
- Use Space Grotesk / Inter as display voice.
