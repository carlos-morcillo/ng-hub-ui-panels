/**
 * Usable inner width of an element: `offsetWidth` minus horizontal paddings
 * and borders. Used by the scrollable strip to size its scroll steps.
 */
export function contentBoxWidth(element: HTMLElement): number {
	const style = getComputedStyle(element);
	return (
		element.offsetWidth -
		parseFloat(style.paddingLeft) -
		parseFloat(style.paddingRight) -
		parseFloat(style.borderLeftWidth) -
		parseFloat(style.borderRightWidth)
	);
}
