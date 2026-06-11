import { contentBoxWidth } from './content-box-width';

/** Builds an element with a fixed `offsetWidth` (the test DOM reports 0). */
function elementWithOffsetWidth(width: number): HTMLElement {
	const element = document.createElement('div');
	Object.defineProperty(element, 'offsetWidth', { value: width });
	document.body.appendChild(element);
	return element;
}

describe('contentBoxWidth', () => {
	it('subtracts horizontal paddings and borders from offsetWidth', () => {
		const element = elementWithOffsetWidth(200);
		element.style.paddingLeft = '10px';
		element.style.paddingRight = '10px';
		element.style.borderLeftWidth = '2px';
		element.style.borderRightWidth = '2px';
		element.style.borderStyle = 'solid';

		expect(contentBoxWidth(element)).toBe(176);
	});

	it('returns offsetWidth untouched when there is no padding or border', () => {
		const element = elementWithOffsetWidth(150);
		element.style.padding = '0';
		element.style.borderWidth = '0';

		expect(contentBoxWidth(element)).toBe(150);
	});
});
