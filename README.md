# ng-hub-ui-panels

[Español](./README.es.md) | **English**

A versatile, accessible **content-panels** container for Angular that renders as
**tabs**, **pills** or an **accordion** from a single API — with routing, reactive
forms, keyboard navigation and CSS-variable theming. Built as standalone Angular
components on top of Signals.

> `ng-hub-ui-panels` supersedes [`ng-hub-ui-accordion`](https://www.npmjs.com/package/ng-hub-ui-accordion). Its accordion view is a drop-in, more capable replacement.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/panels/overview/
- Live examples: https://hubui.dev/panels/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) _(deprecated → use panels)_
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels) ← You are here
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 🚀 Quick Start

### 1. Install

```bash
npm install ng-hub-ui-panels
```

### 2. Import

The components are standalone — import them directly where you use them:

```ts
import { PanelsComponent, PanelComponent, PanelHeadingDirective } from 'ng-hub-ui-panels';
```

### 3. Use

```html
<hub-panels>
	<hub-panel heading="Overview">First panel content</hub-panel>
	<hub-panel heading="Details">Second panel content</hub-panel>
	<hub-panel heading="Settings">Third panel content</hub-panel>
</hub-panels>
```

---

## 📦 Description

`ng-hub-ui-panels` unifies the three most common content-switching patterns —
**tabs**, **pills** and **accordion** — behind one declarative component. Drop
`<hub-panel>` panes inside `<hub-panels>` and pick a `type`; everything else
(keyboard navigation, ARIA wiring, animated collapse, routed panels and form
binding) works the same across views.

## 🎯 Features

- **Three visualizations** — `tabs`, `pills` and `accordion`, switched with a single `type` input.
- **Forms** — implements `ControlValueAccessor`; bind the active panel(s) to a `FormControl` or `ngModel` (single or `multiple`), with `bindValue` and `compareWith`.
- **Routing** — a panel with a `routerLink` turns the content area into a `<router-outlet>` that follows the URL.
- **Keyboard & a11y** — roving tabindex, Arrow/Home/End/Delete keys, and correct `role="tablist"`/`tab`/`tabpanel` and accordion `aria-expanded`/`aria-controls` semantics.
- **Strip layout** — `vertical`, `justified` and `scrollable` header strips.
- **Accordion options** — `multiple` expansion and edge-to-edge `flush` layout, with an animated grid-based collapse.
- **Custom headers** — project any markup with the `hubPanelHeading` directive.
- **Removable panels** — opt-in `removable` panels close with a ✕ button or the Delete key.
- **Theming** — every token is a `--hub-panels-*` CSS custom property; the accordion view also honours the `--hub-accordion-*` contract.

---

## 📦 Installation

```bash
npm install ng-hub-ui-panels
```

### Peer Dependencies

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"@angular/forms": ">=21.0.0",
	"@angular/router": ">=21.0.0"
}
```

---

## ⚙️ Usage

### Tabs (default)

```html
<hub-panels>
	<hub-panel heading="One">First</hub-panel>
	<hub-panel heading="Two">Second</hub-panel>
</hub-panels>
```

### Pills

```html
<hub-panels type="pills"> … </hub-panels>
```

### Accordion

```html
<hub-panels type="accordion" multiple flush>
	<hub-panel heading="Shipping">…</hub-panel>
	<hub-panel heading="Returns">…</hub-panel>
</hub-panels>
```

### Vertical / Justified / Scrollable

```html
<hub-panels vertical> … </hub-panels>
<hub-panels justified> … </hub-panels>
<div style="max-width: 360px">
	<hub-panels scrollable> … many panels … </hub-panels>
</div>
```

### Reactive forms

```html
<hub-panels [formControl]="selected">
	<hub-panel heading="Light" value="light">…</hub-panel>
	<hub-panel heading="Dark" value="dark">…</hub-panel>
</hub-panels>
```

```ts
selected = new FormControl<string>('dark');
```

With `multiple`, the form value is an array. Use `bindValue="meta.key"` to map
each panel's `value` object to a primitive, and `compareWith` for custom equality.

### Routed panels

```html
<hub-panels>
	<hub-panel heading="Profile" routerLink="/account/profile">Loaded via router-outlet</hub-panel>
	<hub-panel heading="Billing" routerLink="/account/billing">Loaded via router-outlet</hub-panel>
</hub-panels>
```

When the active panel is routed, the content area renders a `<router-outlet>` and
the active panel follows the current URL (`tabs` / `pills` views only).

### Custom headers

```html
<hub-panel>
	<ng-template hubPanelHeading>
		<i class="fa-solid fa-gear"></i> Settings <span class="badge text-bg-primary">3</span>
	</ng-template>
	Panel content
</hub-panel>
```

---

## 🪄 API Reference

### `<hub-panels>` inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'tabs' \| 'pills' \| 'accordion'` | `'tabs'` | Visualization of the container. |
| `vertical` | `boolean` | `false` | Stacks the strip beside the content (tabs / pills). |
| `justified` | `boolean` | `false` | Stretches headers to equal width. |
| `scrollable` | `boolean` | `false` | Adds scroll buttons when the strip overflows. |
| `isKeysAllowed` | `boolean` | `true` | Enables keyboard navigation. |
| `multiple` | `boolean` | `false` | Accordion: allow several panels expanded at once. |
| `flush` | `boolean` | `false` | Accordion: edge-to-edge layout without outer chrome. |
| `bindValue` | `string` | `undefined` | Dot-notation path applied to each panel value. |
| `compareWith` | `(a, b) => boolean` | `===` | Equality used to match form values. |

### `<hub-panels>` outputs

| Output | Payload | Description |
| --- | --- | --- |
| `panelChange` | `PanelChangeEvent` | Emitted when a different panel is opened (`{ current, prev }`). |

### `<hub-panel>` inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | `undefined` | Plain-text header (ignored when a `hubPanelHeading` template is present). |
| `id` | `string` | auto | ARIA pairing id. |
| `value` | `unknown` | `id` | Value contributed to the form control. |
| `active` | `boolean` (model) | `false` | Two-way active/expanded state. |
| `disabled` | `boolean` | `false` | Prevents activation. |
| `removable` | `boolean` | `false` | Shows a ✕ and enables the Delete key. |
| `routerLink` | `string \| string[]` | `undefined` | Turns the panel into a routed panel. |
| `queryParams` | `Params` | `undefined` | Query params for `routerLink`. |
| `pathMatch` | `'route' \| 'full'` | `'route'` | URL comparison for routed panels. |
| `customClass` | `string` | `undefined` | Extra classes on the nav item and pane. |

### `<hub-panel>` outputs

| Output | Payload | Description |
| --- | --- | --- |
| `selectPanel` | `PanelComponent` | Emitted when the panel becomes active. |
| `deselectPanel` | `PanelComponent` | Emitted when the panel stops being active. |
| `removed` | `PanelComponent` | Emitted on removal (✕ or Delete). |

### Directive

- `hubPanelHeading` — marks an `<ng-template>` inside a `hub-panel` as its custom header.

### Configuration

Provide `PanelsConfig` to change defaults application-wide:

```ts
providers: [{ provide: PanelsConfig, useValue: { ...new PanelsConfig(), type: 'pills' } }];
```

---

## 🎨 Styling

Everything is themed through `--hub-panels-*` CSS custom properties. See
[`docs/css-variables-reference.md`](./docs/css-variables-reference.md) for the full list.

```css
hub-panels {
	--hub-panels-tab-color-active: #198754;
	--hub-panels-pill-bg-active: #198754;
}
```

The accordion view also reads the `--hub-accordion-*` contract, so themes written
for `ng-hub-ui-accordion` keep working.

---

## ♿ Accessibility

- `tabs` / `pills`: `role="tablist"`, `role="tab"`, `role="tabpanel"`, roving tabindex and `aria-selected`.
- `accordion`: a disclosure button per panel with `aria-expanded` / `aria-controls` and an inert collapsed region.
- Keyboard: Arrow keys, Home, End move focus; Delete removes a `removable` panel; Enter/Space toggle accordion headers.

---

## 📚 Migration from `ng-hub-ui-accordion`

`ng-hub-ui-panels` replaces `ng-hub-ui-accordion`. Map the markup as follows:

| Accordion | Panels |
| --- | --- |
| `<hub-accordion [multiple]="true">` | `<hub-panels type="accordion" multiple>` |
| `<hub-accordion [options]="{ flush: true }">` | `<hub-panels type="accordion" flush>` |
| `<hub-accordion-panel title="…">` | `<hub-panel heading="…">` |
| `<ng-template hubAccordionPanelHeader>` | `<ng-template hubPanelHeading>` |
| `(collapsedChange)` | `(panelChange)` |

Form binding (`formControl` / `ngModel`, `value`, `bindValue`, `compareWith`) works
the same. Existing `--hub-accordion-*` theme overrides keep applying.

---

## 📊 Changelog

See [CHANGELOG.md](./CHANGELOG.md).

---

## 📄 License

MIT © Carlos Morcillo
