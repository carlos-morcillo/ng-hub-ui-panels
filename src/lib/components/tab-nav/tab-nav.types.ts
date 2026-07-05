/**
 * A single entry of the {@link HubTabNavComponent} strip.
 *
 * The tab-nav owns no content: each item is a lightweight descriptor of one
 * selectable tab. Its {@link HubTabNavItem.value} is what the strip emits
 * through `active` / `activeChange` when the tab is chosen — the consumer
 * renders the matching view itself.
 */
export interface HubTabNavItem {
	/** Value emitted through `active` / `activeChange` when this tab is selected. */
	value: unknown;

	/** Visible tab label. */
	label: string;

	/** Whether the tab is non-interactive (skipped by pointer and keyboard). */
	disabled?: boolean;

	/**
	 * Explicit id for the tab `<button>` (ARIA wiring). Falls back to a
	 * deterministic `hub-tab-nav-<index>` id when omitted.
	 */
	id?: string;
}

/**
 * Visual appearance of the {@link HubTabNavComponent} strip: classic
 * underlined `tabs` or rounded `pills`.
 */
export type HubTabNavAppearance = 'tabs' | 'pills';
