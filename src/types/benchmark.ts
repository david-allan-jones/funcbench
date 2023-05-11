import { Units } from "../utils/time"

export type Input<Args> = { name: string, args: Args }
export type Func<Args extends any[]> = (...args: Args) => unknown

export type BuilderOptions<Args extends any[]> = {
    functions?: Func<Args>[],
    samples?: number[],
    inputs?: Input<Args>[],
    units?: Units
}

export type Stats = {
    funcName: string,
    inputName: string,
    samples: number,
    mean: number,
    sigmaSquared: number | null,
    sigma: number | null,
}

type BenchmarkResult = Stats[]

export type BenchmarkBuilder<Args extends any[]> = {
    addFuncs: (funcs: Func<Args> | Func<Args>[]) => BenchmarkBuilder<Args>,
    addInputs: (inputs: Input<Args> | Input<Args>[]) => BenchmarkBuilder<Args>,
    addSamples: (samples: number | number[]) => BenchmarkBuilder<Args>,
    run: (rank?: boolean) => BenchmarkResult,
    removeFuncs: (indices: number | number[]) => BenchmarkBuilder<Args>,
    removeInputs: (indices: number | number[]) => BenchmarkBuilder<Args>,
    removeSamples: (indices: number | number[]) => BenchmarkBuilder<Args>,
    setFuncs: (funcs: Func<Args>[]) => BenchmarkBuilder<Args>,
    setInputs: (inputs: Input<Args>[]) => BenchmarkBuilder<Args>,
    setSamples: (samples: number[]) => BenchmarkBuilder<Args>,
    setUnits: (units: Units) => BenchmarkBuilder<Args>,
}