# Changelog

All notable changes to the ng-hub-ui-panels library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
