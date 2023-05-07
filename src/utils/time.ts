export type Units = 'ns' | 'ms' | 's'

export function convertFromMilliseconds(time: number, to: Units): number {
    switch (to) {
        case 'ms':
            return time
        case 's':
            return time / 1000
        case 'ns':
            return time * 1000000
    }
}
