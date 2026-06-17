import type { PanelComponent } from '../components/panel/panel.component';

/**
 * Visualization of the panels container: classic underlined/boxed `tabs`,
 * rounded `pills`, stacked disclosure panels (`accordion`), or chromeless
 * always-visible cards (`card`) with no navigation strip.
 */
export type PanelsType = 'tabs' | 'pills' | 'accordion' | 'card';

/**
 * Visual appearance of a standalone `<hub-panel>`: a plain `card` container or
 * a semantic `alert` callout. The `alert` appearance derives its colours from
 * the design-system semantic tokens, selected through {@link HubPanelVariant}.
 */
export type HubPanelAppearance = 'card' | 'alert';

/**
 * Semantic colour of a `<hub-panel appearance="alert">`. Each value maps to the
 * matching `--hub-sys-color-<variant>-*` token family (subtle background,
 * subtle border, emphasis text and the solid accent). When omitted the alert
 * uses a neutral look.
 */
export type HubPanelVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info';

/**
 * Event emitted by {@link PanelsComponent.panelChange} when the user
 * activates (opens) a panel.
 */
export interface PanelChangeEvent {
	/** The newly selected panel. */
	current: PanelComponent;
	/**
	 * The panel that was active before the change, if any. Not provided in
	 * accordion view with `multiple`, where several panels stay open.
	 */
	prev?: PanelComponent;
}
