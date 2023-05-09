export function typeNarrowPush<T>(arg: T | T[], list: T[]) : void {
    if (Array.isArray(arg)) {
        arg.forEach(item => list.push(item))
    } else {
        list.push(arg)
    }
}