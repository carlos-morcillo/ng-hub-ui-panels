/**
 * Resolves an accent value to an inline CSS colour for a `--hub-*-accent` slot.
 *
 * A bareword (a semantic name, a registered accent or a CSS named colour)
 * resolves to `var(--hub-sys-color-<value>, <value>)` — the design-system token
 * with the word itself as the raw fallback — so a custom accent palette
 * interconnects with no colour values living in this library. A literal
 * (`#hex` / `rgb()` / `oklch()` / `var()`) is passed through unchanged. Returns
 * `null` for an empty/whitespace value, keeping the accent slot unset.
 *
 * @param value Raw accent value from the component input.
 * @returns The resolved inline colour, or `null` when no accent applies.
 */
export function resolveHubAccent(value: string | null | undefined): string | null {
	const color = value?.trim();
	if (!color) {
		return null;
	}
	return /^[a-zA-Z][\w-]*$/.test(color) ? `var(--hub-sys-color-${color}, ${color})` : color;
}
