# ng-hub-ui-panels

**Español** | [English](./README.md)

Un contenedor de **paneles de contenido** versátil y accesible para Angular que se
renderiza como **tabs**, **pills** o **accordion** desde una sola API — con routing,
formularios reactivos, navegación por teclado y theming con variables CSS. Construido
como componentes standalone de Angular sobre Signals.

> `ng-hub-ui-panels` sustituye a [`ng-hub-ui-accordion`](https://www.npmjs.com/package/ng-hub-ui-accordion). Su vista accordion es un reemplazo directo y más capaz.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/panels/overview/
- Ejemplos en vivo: https://hubui.dev/panels/examples/
- Hub UI: https://hubui.dev/

## 🧩 Familia `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) _(obsoleto → usa panels)_
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
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels) ← Estás aquí
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 🚀 Inicio rápido

### 1. Instalar

```bash
npm install ng-hub-ui-panels
```

### 2. Importar

Los componentes son standalone — impórtalos directamente donde los uses:

```ts
import { PanelsComponent, PanelComponent, PanelHeadingDirective } from 'ng-hub-ui-panels';
```

### 3. Usar

```html
<hub-panels>
	<hub-panel heading="Resumen">Contenido del primer panel</hub-panel>
	<hub-panel heading="Detalles">Contenido del segundo panel</hub-panel>
	<hub-panel heading="Ajustes">Contenido del tercer panel</hub-panel>
</hub-panels>
```

---

## 📦 Descripción

`ng-hub-ui-panels` unifica los tres patrones de conmutación de contenido más
habituales — **tabs**, **pills** y **accordion** — tras un único componente
declarativo. Coloca paneles `<hub-panel>` dentro de `<hub-panels>` y elige un
`type`; todo lo demás (navegación por teclado, semántica ARIA, colapso animado,
paneles enrutados y binding de formularios) funciona igual en las tres vistas.

## 🎯 Características

- **Tres visualizaciones** — `tabs`, `pills` y `accordion`, con un único input `type`.
- **Formularios** — implementa `ControlValueAccessor`; vincula el/los panel(es) activo(s) a un `FormControl` o `ngModel` (simple o `multiple`), con `bindValue` y `compareWith`.
- **Routing** — un panel con `routerLink` convierte el área de contenido en un `<router-outlet>` que sigue la URL.
- **Teclado y accesibilidad** — tabindex móvil, teclas Flecha/Home/End/Delete y roles `role="tablist"`/`tab`/`tabpanel` y semántica `aria-expanded`/`aria-controls` para accordion.
- **Layout de la tira** — tiras de cabeceras `vertical`, `justified` y `scrollable`.
- **Opciones de accordion** — expansión `multiple` y layout `flush` a sangre, con colapso animado basado en grid.
- **Cabeceras personalizadas** — proyecta cualquier marcado con la directiva `hubPanelHeading`.
- **Paneles eliminables** — paneles `removable` que se cierran con un botón ✕ o la tecla Delete.
- **Theming** — cada token es una variable CSS `--hub-panels-*`; la vista accordion también respeta el contrato `--hub-accordion-*`.

---

## 📦 Instalación

```bash
npm install ng-hub-ui-panels
```

### Peer dependencies

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"@angular/forms": ">=21.0.0",
	"@angular/router": ">=21.0.0"
}
```

---

## ⚙️ Uso

### Tabs (por defecto)

```html
<hub-panels>
	<hub-panel heading="Uno">Primero</hub-panel>
	<hub-panel heading="Dos">Segundo</hub-panel>
</hub-panels>
```

### Pills

```html
<hub-panels type="pills"> … </hub-panels>
```

### Accordion

```html
<hub-panels type="accordion" multiple flush>
	<hub-panel heading="Envío">…</hub-panel>
	<hub-panel heading="Devoluciones">…</hub-panel>
</hub-panels>
```

### Vertical / Justified / Scrollable

```html
<hub-panels vertical> … </hub-panels>
<hub-panels justified> … </hub-panels>
<div style="max-width: 360px">
	<hub-panels scrollable> … muchos paneles … </hub-panels>
</div>
```

### Formularios reactivos

```html
<hub-panels [formControl]="selected">
	<hub-panel heading="Claro" value="light">…</hub-panel>
	<hub-panel heading="Oscuro" value="dark">…</hub-panel>
</hub-panels>
```

```ts
selected = new FormControl<string>('dark');
```

Con `multiple`, el valor del formulario es un array. Usa `bindValue="meta.key"` para
mapear el `value` de cada panel a un primitivo, y `compareWith` para igualdad personalizada.

### Selección múltiple

Añade `multiple` para permitir varios paneles abiertos a la vez. En las vistas
`tabs` / `pills` los panes abiertos se renderizan lado a lado (o apilados, si es
`vertical`), cada uno con al menos `--hub-panels-pane-min-width` de ancho; el área
de contenido hace scroll cuando desbordan. En la vista `accordion` se expanden todos
los paneles seleccionados.

```html
<hub-panels multiple [formControl]="open">
	<hub-panel heading="Resumen" value="summary">…</hub-panel>
	<hub-panel heading="Estadísticas" value="stats">…</hub-panel>
	<hub-panel heading="Actividad" value="activity">…</hub-panel>
</hub-panels>
```

```ts
open = new FormControl<string[]>(['summary', 'stats']);
```

### Paneles enrutados

```html
<hub-panels>
	<hub-panel heading="Perfil" routerLink="/account/profile">Cargado vía router-outlet</hub-panel>
	<hub-panel heading="Facturación" routerLink="/account/billing">Cargado vía router-outlet</hub-panel>
</hub-panels>
```

Cuando el panel activo está enrutado, el área de contenido renderiza un
`<router-outlet>` y el panel activo sigue la URL actual (solo vistas `tabs` / `pills`).

### Cabeceras personalizadas

```html
<hub-panel>
	<ng-template hubPanelHeading>
		<i class="fa-solid fa-gear"></i> Ajustes <span class="badge text-bg-primary">3</span>
	</ng-template>
	Contenido del panel
</hub-panel>
```

---

## 🪄 Referencia de API

### Inputs de `<hub-panels>`

| Input | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `type` | `'tabs' \| 'pills' \| 'accordion'` | `'tabs'` | Visualización del contenedor. |
| `vertical` | `boolean` | `false` | Apila la tira junto al contenido (tabs / pills). |
| `justified` | `boolean` | `false` | Estira las cabeceras a igual ancho. |
| `scrollable` | `boolean` | `false` | Añade botones de scroll cuando la tira desborda. |
| `isKeysAllowed` | `boolean` | `true` | Activa la navegación por teclado. |
| `multiple` | `boolean` | `false` | Accordion: permite varios paneles expandidos a la vez. |
| `flush` | `boolean` | `false` | Accordion: layout a sangre sin marco exterior. |
| `bindValue` | `string` | `undefined` | Ruta dot-notation aplicada al valor de cada panel. |
| `compareWith` | `(a, b) => boolean` | `===` | Igualdad usada para cotejar valores de formulario. |

### Outputs de `<hub-panels>`

| Output | Payload | Descripción |
| --- | --- | --- |
| `panelChange` | `PanelChangeEvent` | Se emite al abrir un panel distinto (`{ current, prev }`). |

### Inputs de `<hub-panel>`

| Input | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `heading` | `string` | `undefined` | Cabecera de texto (se ignora con `hubPanelHeading`). |
| `id` | `string` | auto | Id para el emparejamiento ARIA. |
| `value` | `unknown` | `id` | Valor aportado al control de formulario. |
| `active` | `boolean` (model) | `false` | Estado activo/expandido bidireccional. |
| `disabled` | `boolean` | `false` | Impide la activación. |
| `removable` | `boolean` | `false` | Muestra una ✕ y habilita la tecla Delete. |
| `routerLink` | `string \| string[]` | `undefined` | Convierte el panel en un panel enrutado. |
| `queryParams` | `Params` | `undefined` | Query params para `routerLink`. |
| `pathMatch` | `'route' \| 'full'` | `'route'` | Comparación de URL para paneles enrutados. |
| `customClass` | `string` | `undefined` | Clases extra en el nav item y el panel. |

### Outputs de `<hub-panel>`

| Output | Payload | Descripción |
| --- | --- | --- |
| `selectPanel` | `PanelComponent` | Se emite cuando el panel se activa. |
| `deselectPanel` | `PanelComponent` | Se emite cuando el panel deja de estar activo. |
| `removed` | `PanelComponent` | Se emite al eliminarlo (✕ o Delete). |

### Directiva

- `hubPanelHeading` — marca un `<ng-template>` dentro de un `hub-panel` como su cabecera personalizada.

### Configuración

Provee `PanelsConfig` para cambiar los valores por defecto en toda la aplicación:

```ts
providers: [{ provide: PanelsConfig, useValue: { ...new PanelsConfig(), type: 'pills' } }];
```

---

## 🎨 Estilos

Todo se tematiza con variables CSS `--hub-panels-*`. Consulta
[`docs/css-variables-reference.md`](./docs/css-variables-reference.md) para la lista completa.

```css
hub-panels {
	--hub-panels-tab-color-active: #198754;
	--hub-panels-pill-bg-active: #198754;
}
```

La vista accordion también lee el contrato `--hub-accordion-*`, por lo que los temas
escritos para `ng-hub-ui-accordion` siguen funcionando.

---

## ♿ Accesibilidad

- `tabs` / `pills`: `role="tablist"`, `role="tab"`, `role="tabpanel"`, tabindex móvil y `aria-selected`.
- `accordion`: un botón de disclosure por panel con `aria-expanded` / `aria-controls` y una región colapsada inerte.
- Teclado: Flecha, Home y End mueven el foco; Delete elimina un panel `removable`; Enter/Espacio alternan las cabeceras de accordion.

---

## 📚 Migración desde `ng-hub-ui-accordion`

`ng-hub-ui-panels` sustituye a `ng-hub-ui-accordion`. Mapea el marcado así:

| Accordion | Panels |
| --- | --- |
| `<hub-accordion [multiple]="true">` | `<hub-panels type="accordion" multiple>` |
| `<hub-accordion [options]="{ flush: true }">` | `<hub-panels type="accordion" flush>` |
| `<hub-accordion-panel title="…">` | `<hub-panel heading="…">` |
| `<ng-template hubAccordionPanelHeader>` | `<ng-template hubPanelHeading>` |
| `(collapsedChange)` | `(panelChange)` |

El binding de formularios (`formControl` / `ngModel`, `value`, `bindValue`,
`compareWith`) funciona igual. Tus overrides de tema `--hub-accordion-*` se siguen aplicando.

---

## 📊 Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md).

---

## 📄 Licencia

MIT © Carlos Morcillo
