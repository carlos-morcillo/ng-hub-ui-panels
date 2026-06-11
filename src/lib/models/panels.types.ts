import type { PanelComponent } from '../components/panel/panel.component';

/**
 * Visualization of the panels container: classic underlined/boxed `tabs`,
 * rounded `pills`, or stacked disclosure panels (`accordion`).
 */
export type PanelsType = 'tabs' | 'pills' | 'accordion';

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
