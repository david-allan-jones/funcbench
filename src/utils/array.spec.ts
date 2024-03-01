import { typeNarrowPush, typeNarrowRemove } from './array'

describe('array utils', () => {
	describe('typeNarrowPush', () => {
		it('works with non array', () => {
			const arr = ['a']
			typeNarrowPush('b', arr)
			expect(arr).toEqual(['a', 'b'])
		})
		it('works with array', () => {
			const arr = ['a']
			expect(typeNarrowPush(['b', 'c'], arr))
			expect(arr).toEqual(['a', 'b', 'c'])
		})
	})
	
	describe('typeNarrowRemove', () => {
		it('works with non array', () => {
			const arr = ['a', 'b', 'c']
			expect(typeNarrowRemove(0, arr))
			expect(arr).toEqual(['b', 'c'])
		})
		it('works with array', () => {
			const arr = ['a', 'b', 'c']
			expect(typeNarrowRemove([0, 1], arr))
			expect(arr).toEqual(['c'])
		})
	})
})