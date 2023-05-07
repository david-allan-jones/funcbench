import { Units, convertFromMilliseconds } from './utils/time'

type Input<Args> = { name: string, args: Args }

type BuilderOptions<InputType> = {
    functions?: Function[],
    samples?: number[],
    inputs?: Input<InputType>[],
    units?: Units
}

type Stats = {
    funcName: string,
    inputName: string,
    samples: number,
    mean: number | null,
    sigmaSquared: number | null,
    sigma: number | null,
}
type ProfilerResult = Stats[][][]

type Profiler<Args> = {
    run: () => ProfilerResult,
    $params: {
        funcList: Function[],
        inputList: Input<Args>[],
        sampleList: number[],
        units: Units
    }
}

type ProfilerBuilder<Args extends any[]> = {
    addFuncs: (funcs: Function | Function[]) => ProfilerBuilder<Args>,
    addInputs: (inputs: Input<Args> | Input<Args>[]) => ProfilerBuilder<Args>,
    addSamples: (samples: number | number[]) => ProfilerBuilder<Args>,
    build: () => Profiler<Args>
    removeFuncs: (indices: number | number[]) => ProfilerBuilder<Args>,
    removeInputs: (indices: number | number[]) => ProfilerBuilder<Args>,
    removeSamples: (indices: number | number[]) => ProfilerBuilder<Args>,
    setFuncs: (funcs: Function[]) => ProfilerBuilder<Args>,
    setInputs: (inputs: Input<Args>[]) => ProfilerBuilder<Args>,
    setSamples: (samples: number[]) => ProfilerBuilder<Args>,
    setUnits: (units: Units) => ProfilerBuilder<Args>,
}

const profiler = <Args extends any[]>(options?: BuilderOptions<Args>): ProfilerBuilder<Args> => {
    let funcList: Function[] = options?.functions ?? []
    let inputList: Input<Args>[] = options?.inputs ?? []
    let sampleList: number[] = options?.samples ?? []
    let units: Units = options?.units ?? 'ms'

    const addFuncs = function (this: ProfilerBuilder<Args>, funcs: Function | Function[]) {
        if (typeof funcs === 'function') {
            funcList.push(funcs)
            return this
        }
        for (let i = 0; i < funcs.length; i++) {
            funcList.push(funcs[i])
        }
        return this
    }

    const addInputs = function (this: ProfilerBuilder<Args>, inputs: Input<Args> | Input<Args>[]) {
        if (!Array.isArray(inputs)) {
            inputList.push(inputs)
            return this
        }
        for (let i = 0; i < inputs.length; i++) {
            inputList.push(inputs[i])
        }
        return this
    }

    const addSamples = function (this: ProfilerBuilder<Args>, samples: number | number[]) {
        if (typeof samples === 'number') {
            sampleList.push(samples)
            return this
        }
        for (let i = 0; i < samples.length; i++) {
            sampleList.push(samples[i])
        }
        return this
    }

    const build = () => ({
        run: () => {
            let result: ProfilerResult = createResult()
            let f = 0
            while (f < funcList.length) {
                let i = 0
                while (i < inputList.length) {
                    let s = 0
                    while (s < sampleList.length) {
                        result[f][i][s] = createStats(f, i, s)
                        s++
                    }
                    i++
                }
                f++
            }
            return result
        },
        $params: {
            funcList,
            inputList,
            sampleList,
            units,
        }
    })


    const removeFuncs = function (this: ProfilerBuilder<Args>, indices: number | number[]) {
        if (typeof indices === 'number') {
            funcList.splice(indices, 1)
            return this
        }
        const indicesClone = [...indices]
        indicesClone.sort((a, b) => b - a)
        for (let i = 0; i < indices.length; i++) {
            funcList.splice(indicesClone[i], 1)
        }
        return this
    } 

    const removeInputs = function (this: ProfilerBuilder<Args>, indices: number | number[]) {
        if (typeof indices === 'number') {
            inputList.splice(indices, 1)
            return this
        }
        const indicesClone = [...indices]
        indicesClone.sort((a, b) => b - a)
        for (let i = 0; i < indices.length; i++) {
            inputList.splice(indicesClone[i], 1)
        }
        return this
    }

    const removeSamples = function (this: ProfilerBuilder<Args>, indices: number | number[]) {
        if (typeof indices === 'number') {
            sampleList.splice(indices, 1)
            return this
        }
        const indicesClone = [...indices]
        indicesClone.sort((a, b) => b - a)
        for (let i = 0; i < indices.length; i++) {
            sampleList.splice(indicesClone[i], 1)
        }
        return this
    }

    const setFuncs = function (this: ProfilerBuilder<Args>, funcs: Function[]) {
        funcList = funcs
        return this
    } 

    const setInputs = function (this: ProfilerBuilder<Args>, inputs: Input<Args>[]) {
        inputList = inputs
        return this
    } 

    const setSamples = function (this: ProfilerBuilder<Args>, samples: number[]) {
        sampleList = samples
        return this
    } 

    const setUnits = function (this: ProfilerBuilder<Args>, value: Units) {
        units = value
        return this
    }
    
    function createResult(): ProfilerResult {
        const result: ProfilerResult = []
        for (let x = 0; x < funcList.length; x++) {
            result[x] = [];
            for (let y = 0; y < inputList.length; y++) {
              result[x][y] = [];
              for (let z = 0; z < sampleList.length; z++) {
                result[x][y][z] = {
                    funcName: funcList[x].name,
                    inputName: inputList[y].name,
                    samples: sampleList[z],
                    mean: null,
                    sigmaSquared: null,
                    sigma: null
                };
              }
            }
          }
        return result
    }

    function createStats(f: number, i: number, s: number): Stats {
        const times: number[] = []
        for (let j = 0; j < sampleList[s]; j++) {
            const t0 = performance.now()
            funcList[f](...inputList[i].args)
            times.push(performance.now() - t0)
        }
        let mean = times.reduce((a: number, v: number) => a + v, 0) / times.length
        const squaredDiffs = times.map(t => (t - mean)**2)
        let sigmaSquared = squaredDiffs.reduce((a: number, v: number) => a + v, 0) / (times.length - 1)
        mean = convertFromMilliseconds(mean, units)
        sigmaSquared = convertFromMilliseconds(sigmaSquared, units)

        return {
            funcName: funcList[f].name,
            inputName: inputList[i].name,
            mean,
            samples: sampleList[s],
            sigmaSquared,
            sigma: Math.sqrt(sigmaSquared)
        }
    }

    return {
        addFuncs,
        addInputs,
        addSamples,
        build,
        removeFuncs,
        removeInputs,
        removeSamples,
        setFuncs,
        setInputs,
        setSamples,
        setUnits,
    }
}

export {
    profiler
}