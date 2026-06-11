import { Injectable } from '@angular/core';

import type { PanelsType } from '../models/panels.types';

/**
 * Injectable defaults for every `<hub-panels>` in the application.
 *
 * Override at any injector level to change the defaults globally or for a
 * feature subtree:
 *
 * ```ts
 * providers: [{ provide: PanelsConfig, useValue: { ...new PanelsConfig(), type: 'pills' } }]
 * ```
 */
@Injectable({ providedIn: 'root' })
export class PanelsConfig {
	/** Default navigation style — `'tabs'`, `'pills'` or `'accordion'`. */
	type: PanelsType = 'tabs';

	/** Whether keyboard navigation (arrows / Home / End / Delete) is enabled. */
	isKeysAllowed = true;

	/** Accessible label announced for the panel list. */
	ariaLabel = 'Tabs';

	/** Accessible label for the backward scroll button (scrollable mode). */
	scrollBackwardAriaLabel = 'Scroll tabs backward';

	/** Accessible label for the forward scroll button (scrollable mode). */
	scrollForwardAriaLabel = 'Scroll tabs forward';
}
