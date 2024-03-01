import { convertFromMilliseconds } from './time'

describe('time', () => {
	describe('convertFromMilliseconds', () => {
		it('works with ns', () => {
			expect(convertFromMilliseconds(1e3, 'ns')).toEqual(1e9)
		})
		it('works with ms', () => {
			expect(convertFromMilliseconds(1e3, 'ms')).toEqual(1e3)
		})
		it('works with s', () => {
			expect(convertFromMilliseconds(1e3, 's')).toEqual(1)
		})
	})
})
