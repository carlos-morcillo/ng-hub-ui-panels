import { NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	model,
	OnDestroy,
	output,
	Renderer2,
	signal,
	TemplateRef,
	ViewEncapsulation
} from '@angular/core';
import { Params, Router } from '@angular/router';

import { PanelsComponent } from '../panels/panels.component';

/** Monotonic counter backing the auto-generated accessibility ids. */
let nextPanelId = 0;

/**
 * One content panel inside a `<hub-panels>` container.
 *
 * In the `tabs` / `pills` views the host element is the tab *panel*
 * (`role="tabpanel"`) and the clickable header is rendered by
 * {@link PanelsComponent} in the strip. In the `accordion` view this component
 * renders its own disclosure header plus an animated collapse wrapper around
 * the projected content. In every view the header comes from `heading` or from
 * a `<ng-template hubPanelHeading>` projected inside this element.
 *
 * Panels can be plain content panes or routed: when `routerLink` is set, the
 * container renders a `<router-outlet>` instead of the projected panels and
 * the active panel follows the current URL (`tabs` / `pills` views only).
 *
 * @example
 * ```html
 * <hub-panels>
 *   <hub-panel heading="Fields">…</hub-panel>
 *   <hub-panel>
 *     <ng-template hubPanelHeading>Validations <span class="badge">3</span></ng-template>
 *     …
 *   </hub-panel>
 * </hub-panels>
 * ```
 */
@Component({
	selector: 'hub-panel, [hub-panel]',
	exportAs: 'hubPanel',
	imports: [NgTemplateOutlet],
	templateUrl: './panel.component.html',
	// The `card` view styles (and the projected header/footer bands) live here so
	// a standalone `<hub-panel>` — used outside any `<hub-panels>` container, which
	// would otherwise be the only source of the global styles — is styled too.
	// `ViewEncapsulation.None` is required so the rules reach the projected,
	// consumer-owned `[hubPanelHeader]` / `[hubPanelFooter]` elements.
	styleUrl: './panel.component.scss',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'hub-panels__panel',
		'[attr.id]': 'accordionView() || cardView() ? null : id()',
		'[attr.role]': "accordionView() || cardView() ? null : 'tabpanel'",
		'[attr.aria-labelledby]': "accordionView() || cardView() ? null : id() + '-link'",
		'[class.hub-panels__panel--active]': 'active()',
		'[class.hub-panels__panel--accordion]': 'accordionView()',
		'[class.hub-panels__panel--card]': 'cardView()'
	}
})
export class PanelComponent implements OnDestroy {
	/** Host element reference — exposed so the container can detach removed panes. */
	readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	readonly #renderer = inject(Renderer2);
	readonly #router = inject(Router);

	/**
	 * Owning panels container, or `null` when the panel is used standalone
	 * (outside any `<hub-panels>`), in which case it renders as a card.
	 * Exposed to the template for the accordion header.
	 */
	protected readonly tabset = inject(PanelsComponent, { optional: true });

	/** Plain-text panel header. Ignored when a `hubPanelHeading` template exists. */
	readonly heading = input<string | undefined>(undefined);

	/**
	 * Unique id used for the `tab` / `tabpanel` (or accordion header / region)
	 * ARIA pairing. Auto-generated (`hub-panel-<n>`) when not provided.
	 */
	readonly id = input<string>(`hub-panel-${nextPanelId++}`);

	/** Whether the panel cannot be activated. */
	readonly disabled = input(false, { transform: booleanAttribute });

	/** Whether the panel shows a remove affordance (✕ and the Delete key). */
	readonly removable = input(false, { transform: booleanAttribute });

	/**
	 * URL comparison used to mark routed panels active: `'route'` compares the
	 * path only, `'full'` also compares query params.
	 */
	readonly pathMatch = input<'route' | 'full'>('route');

	/** Navigation target that turns this panel into a routed panel. */
	readonly routerLink = input<string | string[] | null | undefined>(undefined);

	/** Query params appended when navigating to `routerLink`. */
	readonly queryParams = input<Params | null | undefined>(undefined);

	/** Extra CSS classes applied to both the nav item and this pane. */
	readonly customClass = input<string | undefined>(undefined);

	/**
	 * Value this panel contributes when the container is used as a form control
	 * (see {@link PanelsComponent} `ControlValueAccessor`). Defaults to `id`.
	 */
	readonly value = input<unknown>(undefined);

	/** Whether the panel is currently active (expanded, in the accordion view). */
	readonly active = model(false);

	/** Emitted when the panel becomes active. */
	readonly selectPanel = output<PanelComponent>();

	/** Emitted when the panel stops being active. */
	readonly deselectPanel = output<PanelComponent>();

	/** Emitted when the panel is removed through the ✕ button or the Delete key. */
	readonly removed = output<PanelComponent>();

	/** Custom header template registered by `PanelHeadingDirective`. */
	readonly headingRef = signal<TemplateRef<unknown> | undefined>(undefined);

	/** Whether the owning container renders the accordion visualization. */
	protected readonly accordionView = computed(() => this.tabset?.isAccordionView() ?? false);

	/**
	 * Whether this panel renders as a card: either inside a `<hub-panels
	 * type="card">` container or standalone (no owning container at all).
	 */
	protected readonly cardView = computed(() => !this.tabset || this.tabset.isCardView());

	/** Form value resolved for this panel: the explicit `value` or the panel id. */
	readonly formValue = computed(() => (this.value() !== undefined ? this.value() : this.id()));

	/** `routerLink` normalised to a segments array, or `null` when not routed. */
	readonly routerUrl = computed<string[] | null>(() => {
		const link = this.routerLink();
		if (!link) {
			return null;
		}
		return Array.isArray(link) ? link : [link];
	});

	/** Last activation state seen by the effect — avoids emitting on init. */
	#wasActive = false;

	constructor() {
		// Standalone panels (no container) render as a card and skip registration.
		this.tabset?.registerPanel(this);

		// Mirror `customClass` onto the pane host element.
		effect((onCleanup) => {
			const classes = (this.customClass() ?? '')
				.split(' ')
				.map((cssClass) => cssClass.trim())
				.filter((cssClass) => cssClass.length > 0);
			for (const cssClass of classes) {
				this.#renderer.addClass(this.elementRef.nativeElement, cssClass);
			}
			onCleanup(() => {
				for (const cssClass of classes) {
					this.#renderer.removeClass(this.elementRef.nativeElement, cssClass);
				}
			});
		});

		// Activation side effects: emit outputs and enforce single-active-panel
		// (unless the container allows multiple expanded panels — accordion mode).
		effect(() => {
			const isActive = this.active();
			if (isActive && this.disabled()) {
				this.active.set(false);
				return;
			}
			if (isActive === this.#wasActive) {
				return;
			}
			this.#wasActive = isActive;
			if (isActive) {
				this.selectPanel.emit(this);
				if (this.tabset && !this.tabset.allowsMultipleActive()) {
					for (const panel of this.tabset.panels()) {
						if (panel !== this) {
							panel.active.set(false);
						}
					}
				}
			} else {
				this.deselectPanel.emit(this);
			}
		});
	}

	ngOnDestroy(): void {
		this.tabset?.removePanel(this, { reselect: false, emit: false });
	}

	/** Route path plus query string, or `null` when the panel is not routed. */
	getFullRoute(): string | null {
		const route = this.getRoute();
		if (!route) {
			return null;
		}
		const queryString = this.getQueryParamsString();
		return queryString ? `${route}?${queryString}` : route;
	}

	/** Normalised absolute route path, or `null` when the panel is not routed. */
	getRoute(): string | null {
		const routerUrl = this.routerUrl();
		if (!routerUrl) {
			return null;
		}
		let route = routerUrl.join('/').replace(/\/\/+/g, '/');
		if (route.charAt(0) === '.') {
			route = route.substring(1);
		}
		if (route.charAt(0) !== '/') {
			route = `/${route}`;
		}
		return route;
	}

	/** `queryParams` serialised as `key=value&…`, or `null` when empty. */
	getQueryParamsString(): string | null {
		const params = this.queryParams();
		if (!params || !Object.keys(params).length) {
			return null;
		}
		return Object.entries(params)
			.map(([key, value]) => `${key}=${value}`)
			.join('&');
	}

	/** Navigates to the panel's route. No-op for non-routed panels. */
	navigate(): void {
		const routerUrl = this.routerUrl();
		if (routerUrl) {
			this.#router.navigate(routerUrl, { queryParams: this.queryParams() ?? {} });
		}
	}

	/** Accordion header click — toggles this panel through the container. */
	protected onAccordionHeaderClick(): void {
		this.tabset?.togglePanel(this);
	}

	/** Accordion header keyboard navigation, delegated to the container. */
	protected onAccordionHeaderKeydown(event: KeyboardEvent): void {
		this.tabset?.onAccordionKeydown(event, this);
	}

	/** Removes this panel through the accordion header's ✕ affordance. */
	protected removeSelf(): void {
		this.tabset?.removePanel(this);
	}
}
