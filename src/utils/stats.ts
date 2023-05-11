import { Stats } from "../types/benchmark";

export function statsSort(a: Stats, b: Stats): number {
    if (a.samples < b.samples) {
        return -1
    } else if (a.samples > b.samples) {
        return 1
    }

    const inputSort = a.inputName.localeCompare(b.inputName)
    if (inputSort !== 0) return inputSort

    if (a.mean && a.mean < b.mean) {
        return -1
    } else if (a.mean > b.mean) {
        return 1
    }
    return 0
}