# Changelog

All notable changes to the ng-hub-ui-panels library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-22

### Added

- New `variant` input on `<hub-panels>` selecting the **semantic accent of the navigation strip**: `<hub-panels variant="success">` recolours the active/hover tab, the active pill and the active accordion header. The built-in variants (`primary` / `success` / `danger` / `warning` / `info`) render with the exact design-system tints; **any other string is also accepted** — the strip reads `--hub-sys-color-<variant>` from the host application and derives the hover/active roles with `color-mix`, so a custom accent palette interconnects with no changes to the library. Defaults to `primary` when omitted. Mirrors the open-set accent system already used by `<hub-panel appearance="alert">`.
- New tokens for the group accent: `--hub-panels-accent`, `--hub-panels-accent-emphasis`, `--hub-panels-accent-subtle`. The strip's active/hover affordances (`--hub-panels-nav-link-active-color`, `--hub-panels-nav-link-hover-color`, `--hub-panels-tab-border-color-active`, `--hub-panels-pill-bg-active`, `--hub-panels-accordion-active-color`, `--hub-panels-accordion-active-bg`) now resolve through this single accent instead of being hard-wired to `--hub-sys-color-primary*`. No visual change with the default `primary` accent.

### Changed

- The outer container chrome now inherits from the `--hub-container-*` base layer (re-base hook): `--hub-panels-content-bg`, `--hub-panels-border-color`, `--hub-panels-border-width`, `--hub-panels-border-radius` and `--hub-panels-content-padding-x/y` default through `var(--hub-container-*, <previous default>)`. Overriding a container token on a subtree now re-bases the panels chrome. No visual change with default tokens.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.3.0] - 2026-06-16

### Added
- New `alert` appearance for a standalone `<hub-panel>`: `<hub-panel appearance="alert" [variant]="…">` renders the panel as a semantic callout (subtle background, subtle border, an accent stripe and emphasis text) with `role="alert"`. Works standalone or inside a `type="card"` container; ignored in the `tabs` / `pills` / `accordion` strip views.
- New `variant` input on `<hub-panel>` selecting the alert's semantic colour; omit it for a neutral alert. Exported types `HubPanelAppearance` and `HubPanelVariant`. The built-in variants (`primary` / `success` / `danger` / `warning` / `info`) render with the exact design-system tints; **any other string is also accepted** — the alert reads `--hub-sys-color-<variant>` from the host application and derives its look with `color-mix`, so a custom accent palette interconnects with no changes to the library.
- New tokens for the alert: `--hub-panels-alert-bg`, `--hub-panels-alert-color`, `--hub-panels-alert-border-color`, `--hub-panels-alert-accent`, `--hub-panels-alert-padding-x`, `--hub-panels-alert-padding-y`, `--hub-panels-alert-border-radius`, `--hub-panels-alert-accent-width`. The per-variant colours are not new token sets — each variant re-points the generic alert tokens at the design-system `--hub-sys-color-<variant>-{subtle,border-subtle,emphasis}` family, so the alert inherits every theme and dark mode automatically.
- `ng-hub-ui-ds` added as an **optional** peer dependency: install it once to give panels (and the rest of the family) the shared `--hub-*` token palette and dark mode. Panels keeps working without it via built-in fallbacks.

## [21.2.0] - 2026-06-14

### Added
- New `card` visualization (`type="card"`): a chromeless format with no navigation strip where every `<hub-panel>` is always visible and rendered as a card. Ideal for a single standalone panel or a stack of cards.
- A `<hub-panel>` can now be used **standalone**, outside any `<hub-panels>` container, in which case it renders as a card on its own (the container injection is optional and the card styles ship with the panel component).
- New content-slot directives `hubPanelHeader` and `hubPanelFooter`: mark an element inside a `<hub-panel>` as the panel's header/footer band. They render in **every** view (`tabs`, `pills`, `accordion`, `card`), distinct from `hubPanelHeading` (the navigational tab/accordion label).
- New tokens: `--hub-panels-card-bg`, `--hub-panels-card-color`, `--hub-panels-card-border-width`, `--hub-panels-card-border-color`, `--hub-panels-card-border-radius`, `--hub-panels-card-box-shadow`, `--hub-panels-card-padding-x`, `--hub-panels-card-padding-y`, `--hub-panels-card-gap`, and the `--hub-panels-panel-header-*` family for the header/footer bands.

## [21.1.1] - 2026-06-12

### Added
- New token: `--hub-panels-header-bg`, used by the tabs/pills strip background. It defaults to `--hub-panels-content-bg`, so the default theme remains unchanged while custom themes can give the header strip its own surface colour.
- New token: `--hub-panels-pill-content-border-width`, which controls the bordered card chrome in the `pills` content area.

### Changed
- The active header background now defaults to `--hub-panels-content-bg`, keeping the active tab/panel fusion aligned automatically when the content surface is rethemed.
- The `pills` content area is borderless by default (`--hub-panels-pill-content-border-width: 0`); themes can opt back into a bordered card by overriding that token.
- In `multiple` tabs/pills, every active header now starts its own visible block, each block keeps the same tabs/pills chrome as a regular panel set, and the layout scrolls horizontally when the blocks exceed the available width.
- In `multiple` tabs/pills, every visible block now stretches its content area to the full available height, matching the single-panel layouts.
- In `multiple` vertical tabs/pills, each visible block now uses the same side-by-side header/content orientation as the regular vertical layouts.
- In `multiple` vertical tabs/pills, the grouped blocks now stack top-to-bottom, and each panel area keeps at least the larger of its content-driven width and its associated header-stack height.
- In `multiple` vertical tabs/pills, each stacked row now stretches across the full available width again; the content-driven/header-driven minimum width applies only to the panel area.
- In regrouped `multiple` vertical tabs/pills, active panes are now re-placed in a second post-render pass so late-rendered blocks no longer end up with empty content areas.
- In `pills` + `multiple` + `vertical`, stacked blocks now draw a divider line between rows so panel boundaries remain visible even with borderless content areas.
- `--hub-panels-pane-gap` now defaults to `0`.

## [21.1.0] - 2026-06-11

### Added
- Multiple selection in the `tabs` / `pills` views: with `multiple`, several panels can be open at once. Each open pane becomes its own bordered box placed next to the others — side by side when the strip is horizontal, stacked when it is `vertical` — sharing the space with a per-pane minimum and scrolling on overflow. The form value is an array.
- New tokens: `--hub-panels-pane-min-width`, `--hub-panels-pane-min-height`, `--hub-panels-pane-gap`, `--hub-panels-nav-content-gap`, `--hub-panels-pill-gap`.

### Fixed
- **Accordion content was not rendered.** The panel template used two unselected `<ng-content>` slots (one per `@if`/`@else` branch); Angular bound projection to the strip-view slot, so the accordion body was always empty. Replaced with a single projection slot, fixing the missing accordion content.
- `tabs` and vertical `tabs` now render as a **single bordered box** around the strip and the content together (one outer border plus an internal divider), instead of two separate boxes. The active tab merges into the content across the divider.
- `pills` view gains spacing between the strip and a bordered content card (`--hub-panels-nav-content-gap`).

### Changed
- The header strip now scrolls smoothly (`scroll-behavior: smooth`).
- Disabled headers show the `not-allowed` cursor.
- `<hub-panels>` now always spans 100% of its parent's width and applies `box-sizing: border-box`.

## [21.0.0] - 2026-06-11

### Added
- Initial release of `ng-hub-ui-panels`.
- `<hub-panels>` container with three visualizations selected by the `type` input: `tabs` (default), `pills` and `accordion`.
- `<hub-panel>` content panes with `heading`, `value`, `active` (two-way), `disabled`, `removable`, `customClass`, `routerLink`, `queryParams` and `pathMatch` inputs.
- `ControlValueAccessor` integration for single and multiple selection, with `bindValue` (dot-notation value mapping) and `compareWith`.
- Routed panels: a panel with a `routerLink` switches the content area to a `<router-outlet>` and the active panel follows the URL.
- Keyboard navigation (Arrow keys, Home, End, Delete) with a roving tabindex for both the tablist and accordion patterns.
- Scrollable header strip (`scrollable`), vertical strip (`vertical`) and equal-width headers (`justified`).
- Accordion view with multiple simultaneous expansion (`multiple`), edge-to-edge layout (`flush`) and an animated grid-based collapse.
- Custom header templates through the `hubPanelHeading` directive.
- `PanelsConfig` injectable for application-wide defaults (default `type`, keyboard toggle, ARIA labels).
- Full `--hub-panels-*` CSS custom-property theming, with the accordion view falling back to the `--hub-accordion-*` token contract for compatibility.

### Notes
- `ng-hub-ui-panels` supersedes `ng-hub-ui-accordion`. The accordion view is a drop-in, more capable replacement for `<hub-accordion>`.
