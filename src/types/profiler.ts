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

type ProfilerResult = Stats[]
type Profiler<Args extends any[]> = {
    run: (rank?: boolean) => ProfilerResult,
}

export type ProfilerBuilder<Args extends any[]> = {
    addFuncs: (funcs: Func<Args> | Func<Args>[]) => ProfilerBuilder<Args>,
    addInputs: (inputs: Input<Args> | Input<Args>[]) => ProfilerBuilder<Args>,
    addSamples: (samples: number | number[]) => ProfilerBuilder<Args>,
    build: () => Profiler<Args>
    removeFuncs: (indices: number | number[]) => ProfilerBuilder<Args>,
    removeInputs: (indices: number | number[]) => ProfilerBuilder<Args>,
    removeSamples: (indices: number | number[]) => ProfilerBuilder<Args>,
    setFuncs: (funcs: Func<Args>[]) => ProfilerBuilder<Args>,
    setInputs: (inputs: Input<Args>[]) => ProfilerBuilder<Args>,
    setSamples: (samples: number[]) => ProfilerBuilder<Args>,
    setUnits: (units: Units) => ProfilerBuilder<Args>,
}