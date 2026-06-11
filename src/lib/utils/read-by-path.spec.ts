import { readByPath } from './read-by-path';

describe('readByPath', () => {
	it('reads a top-level property', () => {
		expect(readByPath({ id: 'workflow-1' }, 'id')).toBe('workflow-1');
	});

	it('reads a nested property with dot notation', () => {
		expect(readByPath({ meta: { key: 'k1' } }, 'meta.key')).toBe('k1');
	});

	it('returns undefined for unresolvable paths and null sources', () => {
		expect(readByPath({ meta: null }, 'meta.key')).toBeUndefined();
		expect(readByPath(null, 'id')).toBeUndefined();
		expect(readByPath({ id: 'x' }, '')).toBeUndefined();
	});
});
