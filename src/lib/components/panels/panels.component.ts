import { NgTemplateOutlet } from '@angular/common';
import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	ElementRef,
	forwardRef,
	inject,
	input,
	output,
	Renderer2,
	signal,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import type { PanelChangeEvent, PanelsType } from '../../models/panels.types';
import { PanelsConfig } from '../../services/panels-config.service';
import { contentBoxWidth } from '../../utils/content-box-width';
import { readByPath } from '../../utils/read-by-path';
import type { PanelComponent } from '../panel/panel.component';

/**
 * Content-panels container — the hub `panels` primitive.
 *
 * Projects `<hub-panel>` panes and renders them in one of three views:
 *
 * - **`tabs` / `pills`** — an accessible `tablist` of clickable headers
 *   (roving tabindex, arrow/Home/End/Delete keys) above the active pane.
 *   Panels with a `routerLink` switch the content area to a `<router-outlet>`
 *   and the active panel follows the URL. With `scrollable`, overflowing
 *   headers get backward/forward scroll buttons.
 * - **`accordion`** — each panel renders as a stacked disclosure panel with an
 *   animated collapse: clicking an open header closes it, `multiple` allows
 *   several panels open at once and `flush` removes the outer chrome. All
 *   panels start collapsed unless a panel is marked `[active]` or a form value
 *   is bound. Routed panels are not supported in this view.
 *
 * The container implements `ControlValueAccessor`, so the active panel(s) can
 * be bound as a form value (`ngModel` / `formControl`): each panel contributes
 * its `value` (or its `id` by default), optionally narrowed with `bindValue`
 * and compared with `compareWith`. With `multiple` the form value is an array.
 *
 * Theming is driven entirely by the `--hub-panels-*` CSS custom properties
 * (see `panels.variables.scss`); the accordion view also honours the
 * `--hub-accordion-*` ng-hub-ui contract as a compatibility fallback.
 *
 * @example
 * ```html
 * <hub-panels type="accordion" multiple [formControl]="openPanels">
 *   <hub-panel heading="Fields" value="fields">…</hub-panel>
 *   <hub-panel heading="Validations" value="validations">…</hub-panel>
 * </hub-panels>
 * ```
 */
@Component({
	selector: 'hub-panels',
	imports: [NgTemplateOutlet, RouterOutlet],
	templateUrl: './panels.component.html',
	// Split by concern (token contract / strip views / accordion view) so each
	// sheet stays inside the `anyComponentStyle` budget.
	styleUrls: ['./panels.variables.scss', './panels.component.scss', './panels.accordion.scss'],
	// Library-style global stylesheet: rules are namespaced under `.hub-panels*`
	// and must reach the projected `hub-panel` panes (host-bound classes).
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PanelsComponent),
			multi: true
		}
	],
	host: {
		class: 'hub-panels',
		'[class.hub-panels--tabs]': "type() === 'tabs'",
		'[class.hub-panels--pills]': "type() === 'pills'",
		'[class.hub-panels--vertical]': 'vertical() && !isAccordionView()',
		'[class.hub-panels--accordion]': 'isAccordionView()',
		'[class.hub-panels--flush]': 'isAccordionView() && flush()',
		'[class.hub-panels--multiple]': 'multiple()',
		'(window:resize)': 'updateScrollButtons()'
	}
})
export class PanelsComponent implements ControlValueAccessor {
	readonly #router = inject(Router);
	readonly #renderer = inject(Renderer2);
	readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	readonly #destroyRef = inject(DestroyRef);

	/** Container-wide defaults (aria labels, default type, keyboard toggle). */
	protected readonly config = inject(PanelsConfig);

	/** Scrollable container hosting the panel headers (`tabs` / `pills` views). */
	readonly navScroller = viewChild<ElementRef<HTMLElement>>('navScroller');

	/** Backward scroll button (only rendered while it can scroll back). */
	readonly prevBtn = viewChild<ElementRef<HTMLElement>>('prevBtn');

	/** Forward scroll button (only rendered while it can scroll forward). */
	readonly nextBtn = viewChild<ElementRef<HTMLElement>>('nextBtn');

	/** Emitted when the user activates (opens) a different panel. */
	readonly panelChange = output<PanelChangeEvent>();

	/** Whether the panel list is stacked beside the content (`tabs` / `pills`). */
	readonly vertical = input(false, { transform: booleanAttribute });

	/** Whether panel headers stretch to share the available width equally. */
	readonly justified = input(false, { transform: booleanAttribute });

	/** Visualization — `'tabs'` (default), `'pills'` or `'accordion'`. */
	readonly type = input<PanelsType>(this.config.type);

	/** Whether keyboard navigation is enabled. */
	readonly isKeysAllowed = input(this.config.isKeysAllowed, {
		transform: booleanAttribute
	});

	/** Whether overflowing headers get backward/forward scroll buttons. */
	readonly scrollable = input(false, { transform: booleanAttribute });

	/** Accordion view: whether several panels may be expanded at once. */
	readonly multiple = input(false, { transform: booleanAttribute });

	/** Accordion view: edge-to-edge panels without outer borders or radius. */
	readonly flush = input(false, { transform: booleanAttribute });

	/**
	 * Dot-notation path applied to each panel's `value` to obtain the emitted
	 * form value (e.g. `'meta.key'`). Empty by default — the raw value is used.
	 */
	readonly bindValue = input<string | undefined>(undefined);

	/** Equality used to match form values against panel values. `===` by default. */
	readonly compareWith = input<(a: unknown, b: unknown) => boolean>((a, b) => a === b);

	/** Registered panels, in projection order. */
	readonly panels = signal<PanelComponent[]>([]);

	/** Currently active panel, if any (the first one, under `multiple`). */
	readonly activePanel = computed(() => this.panels().find((panel) => panel.active()));

	/** Whether the container renders the accordion visualization. */
	readonly isAccordionView = computed(() => this.type() === 'accordion');

	/**
	 * Whether more than one panel may be active at once. Driven solely by
	 * `multiple`, so it applies to every view: in the accordion view several
	 * panels stay expanded; in the `tabs` / `pills` views several panes render
	 * side by side (or stacked, when `vertical`).
	 */
	readonly allowsMultipleActive = computed(() => this.multiple());

	/** Whether the bound form control disabled the whole container. */
	readonly formDisabled = signal(false);

	/**
	 * Whether the active panel routes its content through a `<router-outlet>`.
	 * Never true in the accordion view, where routed panels are not supported.
	 */
	protected readonly activePanelHasRouter = computed(
		() => !this.isAccordionView() && !!this.activePanel()?.routerUrl()
	);

	/** Whether the strip cannot scroll further backward. */
	readonly backwardIsDisabled = signal(true);

	/** Whether the strip cannot scroll further forward. */
	readonly forwardIsDisabled = signal(false);

	#isDestroyed = false;
	#syncScheduled = false;
	#viewInitialised = false;

	/** Last value written by the bound form control; `null` when no form. */
	#formValue: unknown[] | null = null;

	#onChange: (value: unknown) => void = () => undefined;
	#onTouched: () => void = () => undefined;

	constructor() {
		this.#destroyRef.onDestroy(() => {
			this.#isDestroyed = true;
		});

		afterNextRender(() => {
			this.#viewInitialised = true;
			this.updateScrollButtons();
			this.setActivePanel();
			// Re-apply any form value written before the panels' inputs were bound.
			this.#applyFormValue();
			this.#ensureActivePanel();
			this.#router.events
				.pipe(
					filter((event) => event instanceof NavigationEnd),
					takeUntilDestroyed(this.#destroyRef)
				)
				.subscribe(() => this.setActivePanel());
		});
	}

	/**
	 * Registers a panel in the container. Called by `PanelComponent` on
	 * construction — not meant for manual use.
	 */
	registerPanel(panel: PanelComponent): void {
		this.panels.update((panels) => [...panels, panel]);
		this.#scheduleSync();
	}

	/**
	 * Removes a panel from the container. `reselect` activates the closest
	 * enabled neighbour when the removed panel was active; `emit` fires the
	 * panel's `removed` output.
	 */
	removePanel(panel: PanelComponent, options: { reselect?: boolean; emit?: boolean } = {}): void {
		const { reselect = true, emit = true } = options;
		const panels = this.panels();
		const index = panels.indexOf(panel);
		if (index === -1 || this.#isDestroyed) {
			return;
		}

		if (reselect && panel.active() && !this.isAccordionView()) {
			const closestIndex = this.#closestEnabledIndex(index);
			if (closestIndex !== -1) {
				panels[closestIndex].active.set(true);
			}
		}
		if (emit) {
			panel.removed.emit(panel);
		}

		this.panels.update((currentPanels) => currentPanels.filter((candidate) => candidate !== panel));

		// Detach the projected pane: the consumer template still owns the node,
		// so removing the header alone would leave the pane content behind.
		const paneElement = panel.elementRef.nativeElement;
		if (paneElement.parentNode) {
			this.#renderer.removeChild(paneElement.parentNode, paneElement);
		}
		if (panel.active()) {
			panel.active.set(false);
			this.#emitFormValue();
		}
		this.#scheduleSync();
	}

	/**
	 * Activates a panel on behalf of the user (`tabs` / `pills` views): marks it
	 * active, navigates when routed, and emits `panelChange`. In `multiple` mode
	 * clicking an active panel toggles it off (the panes render side by side);
	 * otherwise an already-active panel no-ops. Disabled panels always no-op.
	 */
	selectPanel(panel: PanelComponent): void {
		if (panel.disabled() || this.formDisabled()) {
			return;
		}
		if (this.allowsMultipleActive()) {
			if (panel.active()) {
				panel.active.set(false);
			} else {
				panel.active.set(true);
				panel.navigate();
				this.panelChange.emit({ prev: undefined, current: panel });
			}
			this.#emitFormValue();
			this.#onTouched();
			return;
		}
		if (panel.active()) {
			return;
		}
		const previousPanel = this.activePanel();
		panel.active.set(true);
		panel.navigate();
		this.panelChange.emit({ prev: previousPanel, current: panel });
		this.#emitFormValue();
		this.#onTouched();
	}

	/**
	 * Toggles a panel on behalf of the user (accordion view): an open panel
	 * closes, a closed one opens — closing the others unless `multiple`.
	 * Emits `panelChange` when a panel opens.
	 */
	togglePanel(panel: PanelComponent): void {
		if (panel.disabled() || this.formDisabled()) {
			return;
		}
		if (panel.active()) {
			panel.active.set(false);
		} else {
			const previousPanel = this.allowsMultipleActive() ? undefined : this.activePanel();
			panel.active.set(true);
			this.panelChange.emit({ prev: previousPanel, current: panel });
		}
		this.#emitFormValue();
		this.#onTouched();
	}

	/**
	 * Marks the routed panel matching the current URL as active. Does not
	 * navigate — activation through this path is URL-driven. No-op in the
	 * accordion view, where routed panels are not supported.
	 */
	setActivePanel(): void {
		if (this.isAccordionView()) {
			return;
		}
		const [route, queryString] = this.#router.url.split('?');
		for (const panel of this.panels()) {
			if (!panel.routerUrl()) {
				continue;
			}
			let matches: boolean;
			if (panel.pathMatch() === 'full') {
				const currentUrl = queryString?.trim() ? `${route}?${queryString.trim()}` : route;
				matches = currentUrl === panel.getFullRoute();
			} else {
				matches = route === panel.getRoute();
			}
			if (matches) {
				if (!panel.active()) {
					panel.active.set(true);
				}
				break;
			}
		}
	}

	// ── ControlValueAccessor ────────────────────────────────────────────────

	/**
	 * Writes the form value into the container: panels whose (`bindValue`-mapped)
	 * value matches are activated, the rest are deactivated. With `multiple` an
	 * array is expected; otherwise a single value.
	 */
	writeValue(value: unknown): void {
		if (value == null) {
			this.#formValue = [];
		} else if (this.multiple()) {
			this.#formValue = Array.isArray(value) ? [...value] : [value];
		} else {
			this.#formValue = Array.isArray(value) ? value.slice(0, 1) : [value];
		}
		this.#applyFormValue();
	}

	/** Registers the form-control change callback. */
	registerOnChange(onChange: (value: unknown) => void): void {
		this.#onChange = onChange;
	}

	/** Registers the form-control touched callback. */
	registerOnTouched(onTouched: () => void): void {
		this.#onTouched = onTouched;
	}

	/** Enables/disables every panel header on behalf of the form control. */
	setDisabledState(isDisabled: boolean): void {
		this.formDisabled.set(isDisabled);
	}

	/** Keyboard navigation for the panel strip (arrows / Home / End / Delete). */
	protected onPanelKeydown(event: KeyboardEvent, index: number): void {
		if (!this.isKeysAllowed()) {
			return;
		}
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				if (event.key === 'ArrowDown' && !this.vertical()) {
					return;
				}
				event.preventDefault();
				this.#focusPanelAt(this.#stepEnabledIndex(index, 1));
				return;
			case 'ArrowLeft':
			case 'ArrowUp':
				if (event.key === 'ArrowUp' && !this.vertical()) {
					return;
				}
				event.preventDefault();
				this.#focusPanelAt(this.#stepEnabledIndex(index, -1));
				return;
			case 'Home':
				event.preventDefault();
				this.#focusPanelAt(this.panels().findIndex((panel) => !panel.disabled()));
				return;
			case 'End': {
				event.preventDefault();
				const panels = this.panels();
				this.#focusPanelAt(panels.length - 1 - [...panels].reverse().findIndex((panel) => !panel.disabled()));
				return;
			}
			case 'Delete': {
				const panel = this.panels()[index];
				if (panel?.removable()) {
					this.removePanel(panel);
					queueMicrotask(() => this.#focusPanelAt(Math.min(index, this.panels().length - 1)));
				}
			}
		}
	}

	/**
	 * Keyboard navigation between accordion headers (arrows / Home / End /
	 * Delete). Enter and Space toggle natively through the button click.
	 */
	onAccordionKeydown(event: KeyboardEvent, panel: PanelComponent): void {
		if (!this.isKeysAllowed()) {
			return;
		}
		const index = this.panels().indexOf(panel);
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				this.#focusPanelAt(this.#stepEnabledIndex(index, 1));
				return;
			case 'ArrowUp':
				event.preventDefault();
				this.#focusPanelAt(this.#stepEnabledIndex(index, -1));
				return;
			case 'Home':
				event.preventDefault();
				this.#focusPanelAt(this.panels().findIndex((candidate) => !candidate.disabled()));
				return;
			case 'End': {
				event.preventDefault();
				const panels = this.panels();
				this.#focusPanelAt(panels.length - 1 - [...panels].reverse().findIndex((candidate) => !candidate.disabled()));
				return;
			}
			case 'Delete': {
				if (panel.removable()) {
					this.removePanel(panel);
					queueMicrotask(() => this.#focusPanelAt(Math.min(index, this.panels().length - 1)));
				}
			}
		}
	}

	/** Recomputes the enabled/disabled state of the scroll buttons. */
	protected updateScrollButtons(): void {
		if (!this.scrollable() || this.isAccordionView()) {
			return;
		}
		const scroller = this.navScroller()?.nativeElement;
		if (!scroller) {
			return;
		}
		const { scrollLeft, scrollWidth } = scroller;
		this.backwardIsDisabled.set(scrollLeft <= 0);
		this.forwardIsDisabled.set(scrollLeft + contentBoxWidth(scroller) + 1 >= scrollWidth);
	}

	/** Updates the scroll buttons as the strip scrolls. */
	protected onScroll(): void {
		this.updateScrollButtons();
	}

	/** Scrolls the panel headers one viewport backward. */
	protected navBackward(): void {
		const scroller = this.navScroller()?.nativeElement;
		if (!scroller) {
			return;
		}
		const step = contentBoxWidth(scroller) - this.#visibleScrollButtonsWidth();
		scroller.scrollLeft = Math.max(scroller.scrollLeft - step, 0);
	}

	/** Scrolls the panel headers one viewport forward. */
	protected navForward(): void {
		const scroller = this.navScroller()?.nativeElement;
		if (!scroller) {
			return;
		}
		const step = contentBoxWidth(scroller) - this.#visibleScrollButtonsWidth();
		const lastPosition = scroller.scrollWidth - step;
		scroller.scrollLeft = Math.min(scroller.scrollLeft + step, lastPosition);
	}

	/** Width currently taken by the visible scroll buttons. */
	#visibleScrollButtonsWidth(): number {
		return [this.prevBtn()?.nativeElement, this.nextBtn()?.nativeElement].reduce(
			(total, button) => (button ? total + contentBoxWidth(button) : total),
			0
		);
	}

	/** Index of the enabled panel closest to `index`, or `-1` when none exists. */
	#closestEnabledIndex(index: number): number {
		const panels = this.panels();
		for (let step = 1; step <= panels.length; step += 1) {
			const previous = panels[index - step];
			if (previous && !previous.disabled()) {
				return index - step;
			}
			const next = panels[index + step];
			if (next && !next.disabled()) {
				return index + step;
			}
		}
		return -1;
	}

	/** Next enabled panel index from `index` in `direction`, wrapping around. */
	#stepEnabledIndex(index: number, direction: 1 | -1): number {
		const panels = this.panels();
		for (let step = 1; step <= panels.length; step += 1) {
			const candidate = (index + direction * step + panels.length * step) % panels.length;
			if (!panels[candidate].disabled()) {
				return candidate;
			}
		}
		return index;
	}

	/** Moves DOM focus to the panel header at `index` (strip link or accordion button). */
	#focusPanelAt(index: number): void {
		if (index < 0) {
			return;
		}
		const selector = this.isAccordionView() ? '.hub-panels__accordion-btn' : '.hub-panels__nav-link';
		const headers = this.#elementRef.nativeElement.querySelectorAll<HTMLElement>(selector);
		headers[index]?.focus();
	}

	/**
	 * Coalesces post-registration/removal housekeeping into one microtask:
	 * re-applies the bound form value to the current panels, guarantees an
	 * active panel (non-routed `tabs` / `pills` containers without a bound
	 * form) and refreshes the scroll buttons after the strip changed size.
	 * Skipped until the first render — before it the projected panels' inputs
	 * are not bound yet, and the constructor's `afterNextRender` performs the
	 * initial pass instead.
	 */
	#scheduleSync(): void {
		if (this.#syncScheduled || this.#isDestroyed) {
			return;
		}
		this.#syncScheduled = true;
		queueMicrotask(() => {
			this.#syncScheduled = false;
			if (this.#isDestroyed || !this.#viewInitialised) {
				return;
			}
			this.#applyFormValue();
			this.#ensureActivePanel();
			this.updateScrollButtons();
		});
	}

	/**
	 * Activates the first enabled panel when none is active. Skipped for the
	 * accordion view (panels start collapsed), for routed containers (the URL
	 * is the single source of truth) and when a form value is bound (the form
	 * is).
	 */
	#ensureActivePanel(): void {
		if (this.isAccordionView() || this.#formValue !== null) {
			return;
		}
		const panels = this.panels();
		if (!panels.length || panels.some((panel) => panel.active())) {
			return;
		}
		if (panels.some((panel) => !!panel.routerUrl())) {
			return;
		}
		panels.find((panel) => !panel.disabled())?.active.set(true);
	}

	/** Activates/deactivates panels so they mirror the bound form value. */
	#applyFormValue(): void {
		if (this.#formValue === null) {
			return;
		}
		const compare = this.compareWith();
		for (const panel of this.panels()) {
			const panelValue = this.#comparableValue(panel);
			const matches = this.#formValue.some((selectedValue) => compare(selectedValue, panelValue));
			if (panel.active() !== matches) {
				panel.active.set(matches);
			}
		}
	}

	/** Emits the current selection through the form-control callback. */
	#emitFormValue(): void {
		const compare = this.compareWith();
		const activeValues = this.panels()
			.filter((panel) => panel.active())
			.map((panel) => this.#comparableValue(panel));
		if (this.#formValue !== null) {
			this.#formValue = [...activeValues];
		}
		// Deduplicate defensively when several panels share the same value.
		const uniqueValues = activeValues.filter(
			(value, index) => activeValues.findIndex((candidate) => compare(candidate, value)) === index
		);
		this.#onChange(this.multiple() ? uniqueValues : (uniqueValues[0] ?? null));
	}

	/** Form value of a panel with the `bindValue` path applied. */
	#comparableValue(panel: PanelComponent): unknown {
		const rawValue = panel.formValue();
		const bindPath = this.bindValue();
		return bindPath ? readByPath(rawValue, bindPath) : rawValue;
	}
}
