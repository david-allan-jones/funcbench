export type Units = 'ns' | 'ms' | 's'

export function convertFromMilliseconds(time: number, to: Units): number {
    switch (to) {
        case 'ns':
            return time * 1000000
        case 'ms':
            return time
        case 's':
            return time / 1000
    }
}
