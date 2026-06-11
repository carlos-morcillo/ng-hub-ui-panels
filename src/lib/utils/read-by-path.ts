/**
 * Reads a nested value from an object using dot-notation path syntax
 * (e.g. `id`, `meta.key`). Returns `undefined` when the path cannot be
 * resolved. Used by the panels' `bindValue` form-value mapping.
 */
export function readByPath(source: unknown, path: string): unknown {
	if (source == null || !path) {
		return undefined;
	}
	return path.split('.').reduce((currentValue: unknown, segment) => {
		if (currentValue == null) {
			return undefined;
		}
		return (currentValue as Record<string, unknown>)[segment];
	}, source);
}
