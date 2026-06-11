import { Directive, inject, TemplateRef } from '@angular/core';

import { PanelComponent } from '../components/panel/panel.component';

/**
 * Marks an `<ng-template>` inside a `hub-panel` as that panel's custom header
 * (strip link in `tabs`/`pills` view, disclosure button in `accordion` view),
 * replacing the plain-text `heading` input.
 *
 * @example
 * ```html
 * <hub-panel>
 *   <ng-template hubPanelHeading><em>Rich</em> heading</ng-template>
 *   Panel content
 * </hub-panel>
 * ```
 */
@Directive({ selector: '[hubPanelHeading]' })
export class PanelHeadingDirective {
	constructor() {
		inject(PanelComponent).headingRef.set(inject(TemplateRef));
	}
}
