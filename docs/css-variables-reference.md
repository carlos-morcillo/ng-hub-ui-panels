# ng-hub-ui-panels — CSS Variables Reference

Complete reference of the CSS custom properties exposed by `ng-hub-ui-panels`.
Use these variables to customize the visual appearance without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Layout & Content](#layout--content)
- [Tab Headers](#tab-headers)
- [Pills](#pills)
- [Accordion View](#accordion-view)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

Every public token is declared once on `.hub-panels` with a fallback chain:

```text
component token -> sys token -> ref token -> literal fallback
```

The accordion view adds one extra link so existing accordion themes keep working:

```text
--hub-panels-accordion-* -> --hub-accordion-* -> sys/ref -> literal
```

Defaults are declared inside `:where(.hub-panels)` (zero specificity), so any rule
you write — e.g. `hub-panels { --hub-panels-tab-color-active: #198754; }` — wins.

---

## Layout & Content

| Variable | Default |
| --- | --- |
| `--hub-panels-flex-direction` | `row` |
| `--hub-panels-border-width` | `1px` |
| `--hub-panels-border-color` | `#dee2e6` |
| `--hub-panels-border-radius` | `0.375rem` |
| `--hub-panels-content-bg` | `#fff` |
| `--hub-panels-header-bg` | `var(--hub-panels-content-bg)` |
| `--hub-panels-content-box-shadow` | `none` |
| `--hub-panels-content-padding-x` | `1rem` |
| `--hub-panels-content-padding-y` | `1rem` |
| `--hub-panels-nav-gap` | `0` |
| `--hub-panels-nav-btn-width` | `1.5rem` |
| `--hub-panels-nav-btn-height` | `1.5rem` |

---

## Tab Headers

Used by the `tabs` and `pills` strip headers.

| Variable | Default |
| --- | --- |
| `--hub-panels-tab-font-family` | inherits container font |
| `--hub-panels-tab-font-size` | `1rem` |
| `--hub-panels-tab-font-weight` | `500` |
| `--hub-panels-tab-line-height` | `1.5` |
| `--hub-panels-tab-padding-x` | `1rem` |
| `--hub-panels-tab-padding-y` | `0.5rem` |
| `--hub-panels-tab-gap` | `0.5rem` |
| `--hub-panels-tab-color` | `#212529` |
| `--hub-panels-tab-bg` | `transparent` |
| `--hub-panels-tab-bg-hover` | `#f8f9fa` |
| `--hub-panels-tab-color-hover` | `#0a58ca` |
| `--hub-panels-tab-color-active` | `#0d6efd` |
| `--hub-panels-tab-bg-active` | `#fff` |
| `--hub-panels-tab-border-color-active` | `#0d6efd` |
| `--hub-panels-tab-active-shadow` | `0 -0.25rem 0.5rem rgba(0, 0, 0, 0.06)` |
| `--hub-panels-tab-active-shadow-vertical` | `-0.25rem 0 0.5rem rgba(0, 0, 0, 0.06)` |
| `--hub-panels-tab-color-disabled` | `#6c757d` |
| `--hub-panels-tab-focus-ring-width` | `0.25rem` |
| `--hub-panels-tab-focus-ring-color` | `rgba(13, 110, 253, 0.25)` |
| `--hub-panels-tab-transition` | `all 0.2s ease-in-out` |
| `--hub-panels-remove-btn-opacity` | `0.6` |
| `--hub-panels-remove-btn-opacity-hover` | `1` |

---

## Pills

| Variable | Default |
| --- | --- |
| `--hub-panels-pill-border-radius` | `50rem` |
| `--hub-panels-pill-bg-active` | `#0d6efd` |
| `--hub-panels-pill-color-active` | `#fff` |
| `--hub-panels-pill-gap` | `0.5rem` |
| `--hub-panels-pill-content-border-width` | `0` |
| `--hub-panels-nav-content-gap` | `1rem` |

---

## Multiple Selection

Layout of the side-by-side (or stacked) panes when the `tabs` / `pills` views use `multiple`.

| Variable | Default |
| --- | --- |
| `--hub-panels-pane-min-width` | `16rem` |
| `--hub-panels-pane-min-height` | `8rem` |
| `--hub-panels-pane-gap` | `1rem` |

---

## Accordion View

Each token falls back to the matching `--hub-accordion-*` variable.

| Variable | Default |
| --- | --- |
| `--hub-panels-accordion-color` | `#212529` |
| `--hub-panels-accordion-bg` | `#fff` |
| `--hub-panels-accordion-border-width` | `1px` |
| `--hub-panels-accordion-border-color` | `#dee2e6` |
| `--hub-panels-accordion-border-radius` | `0.25rem` |
| `--hub-panels-accordion-btn-padding-x` | `1.25rem` |
| `--hub-panels-accordion-btn-padding-y` | `1rem` |
| `--hub-panels-accordion-btn-color` | `#212529` |
| `--hub-panels-accordion-btn-bg` | `#fff` |
| `--hub-panels-accordion-active-color` | `#0c63e4` |
| `--hub-panels-accordion-active-bg` | `#e7f1ff` |
| `--hub-panels-accordion-icon-color` | inherits btn color |
| `--hub-panels-accordion-icon-active-color` | inherits active color |
| `--hub-panels-accordion-btn-icon-width` | `1.25rem` |
| `--hub-panels-accordion-btn-icon-transform` | `rotate(-180deg)` |
| `--hub-panels-accordion-btn-icon-transition` | `transform 0.2s ease-in-out` |
| `--hub-panels-accordion-collapse-transition-duration` | `0.25s` |
| `--hub-panels-accordion-collapse-transition-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--hub-panels-accordion-body-padding-x` | `1.25rem` |
| `--hub-panels-accordion-body-padding-y` | `1rem` |

---

## Customization Examples

Brand-coloured pills:

```css
hub-panels {
	--hub-panels-pill-bg-active: #198754;
	--hub-panels-pill-color-active: #fff;
}
```

Compact, square tabs:

```css
hub-panels {
	--hub-panels-tab-padding-x: 0.75rem;
	--hub-panels-tab-padding-y: 0.375rem;
	--hub-panels-border-radius: 0;
}
```

Re-theme the accordion view through the shared accordion tokens (also applies to
the deprecated `ng-hub-ui-accordion`):

```css
hub-panels {
	--hub-accordion-active-bg: #fff3cd;
	--hub-accordion-active-color: #664d03;
}
```

---

## Best Practices

- Scope overrides to a wrapper (`.my-panels { … }`) rather than the global `:root`
  when you need different themes on the same page.
- Prefer the `--hub-sys-*` / `--hub-ref-*` design tokens when integrating with the
  wider Hub UI token system — the component tokens already consume them.
- Reuse `--hub-accordion-*` variables to keep a single source of truth while you
  migrate from `ng-hub-ui-accordion` to `ng-hub-ui-panels`.
