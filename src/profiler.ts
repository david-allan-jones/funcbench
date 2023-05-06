type Units = 'ms' | 's'

type Input<T> = { name: string, value: T }

type BuilderOptions<InputType> = {
    functions?: Function[],
    samples?: number[],
    inputs?: Input<InputType>[],
    units?: Units
}

type Stats = {
    funcName: string,
    inputName: string,
    mean: number,
    samples: number,
    sigmaSquared: number,
    sigma: number,
}
type ProfilerResult = Stats[][][]

type Profiler<InputType> = {
    run: () => ProfilerResult,
    $funcList: Function[],
    $inputList: Input<InputType>[], 
    $sampleList: number[],
}

type ProfilerBuilder<InputType> = {
    appendFuncs: (funcs: Function | Function[]) => ProfilerBuilder<InputType>,
    removeFuncs: (indices: number | number[]) => ProfilerBuilder<InputType>,
    setFuncs: (funcs: Function[]) => ProfilerBuilder<InputType>,
    appendSamples: (samples: number | number[]) => ProfilerBuilder<InputType>,
    removeSamples: (indices: number | number[]) => ProfilerBuilder<InputType>,
    setSamples: (samples: number[]) => ProfilerBuilder<InputType>,
    appendInputs: (inputs: Input<InputType> | Input<InputType>[]) => ProfilerBuilder<InputType>,
    removeInputs: (indices: number | number[]) => ProfilerBuilder<InputType>,
    setInputs: (inputs: Input<InputType>[]) => ProfilerBuilder<InputType>,
    setUnits: (Units) => ProfilerBuilder<InputType>,
    build: () => Profiler<InputType>
}

const profiler = <T>(options?: BuilderOptions<T>): ProfilerBuilder<T> => {
    let funcList: Function[] = options?.functions ?? []
    let inputList: Input<T>[] = options?.inputs ?? []
    let sampleList: number[] = options?.samples ?? []
    let units: Units = options?.units ?? 'ms'

    const setFuncs = function (funcs: Function[]) {
        funcList = funcs
        return this
    } 

    const removeFuncs = function (indices: number | number[]) {
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

    const appendFuncs = function (funcs: Function | Function[]) {
        if (typeof funcs === 'function') {
            funcList.push(funcs)
            return this
        }
        for (let i = 0; i < funcs.length; i++) {
            funcList.push(funcs[i])
        }
        return this
    }

    const setSamples = function (samples: number[]) {
        sampleList = samples
        return this
    } 

    const removeSamples = function (indices: number | number[]) {
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

    const appendSamples = function (samples: number | number[]) {
        if (typeof samples === 'number') {
            sampleList.push(samples)
            return this
        }
        for (let i = 0; i < samples.length; i++) {
            sampleList.push(samples[i])
        }
        return this
    }

    const setInputs = function (inputs: Input<T>[]) {
        inputList = inputs
        return this
    } 

    const removeInputs = function (indices: number | number[]) {
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

    const appendInputs = function (inputs: Input<T> | Input<T>[]) {
        if (!Array.isArray(inputs)) {
            inputList.push(inputs)
            return this
        }
        for (let i = 0; i < inputs.length; i++) {
            inputList.push(inputs[i])
        }
        return this
    }

    const setUnits = function (value: Units) {
        units = value
        return this
    }
    
    const createResult = function(): ProfilerResult {
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

    const createStats = function(f: number, i: number, s: number): Stats {
        const times: number[] = []
        for (let j = 0; j < sampleList[s]; j++) {
            const t0 = performance.now()
            funcList[f](inputList[i].value)
            times.push(performance.now() - t0)
        }
        let mean = times.reduce((a: number, v: number) => a + v, 0) / times.length
        const squaredDiffs = times.map(t => (t - mean)**2)
        let sigmaSquared = squaredDiffs.reduce((a: number, v: number) => a + v, 0) / (times.length - 1)
        if (units === 's') {
            mean = mean / 1000
            sigmaSquared = sigmaSquared / 1000
        }
        return {
            funcName: funcList[f].name,
            inputName: inputList[i].name,
            mean,
            samples: sampleList[s],
            sigmaSquared,
            sigma: Math.sqrt(sigmaSquared)
        }
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
        $funcList: funcList,
        $inputList: inputList,
        $sampleList: sampleList,
    })

    return {
        appendFuncs,
        removeFuncs,
        setFuncs,
        appendSamples,
        removeSamples,
        setSamples,
        appendInputs,
        removeInputs,
        setInputs,
        setUnits,
        build,
    }
}

export {
    profiler
}