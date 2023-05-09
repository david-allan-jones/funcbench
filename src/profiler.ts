import { Units, convertFromMilliseconds } from './utils/time'
import { typeNarrowPush } from './utils/type'
import {
    BuilderOptions,
    Func,
    Input,
    ProfilerBuilder,
    Stats
} from './types/profiler'


const profiler = <Args extends any[]>(options?: BuilderOptions<Args>): ProfilerBuilder<Args> => {
    let funcList: Func<Args>[] = options?.functions ?? []
    let inputList: Input<Args>[] = options?.inputs ?? []
    let sampleList: number[] = options?.samples ?? []
    let units: Units = options?.units ?? 'ms'

    function addFuncs(this: ProfilerBuilder<Args>, funcs: Func<Args> | Func<Args>[]) {
        typeNarrowPush<Func<Args>>(funcs, funcList)
        return this
    }

    function addInputs(this: ProfilerBuilder<Args>, inputs: Input<Args> | Input<Args>[]) {
        typeNarrowPush<Input<Args>>(inputs, inputList)
        return this
    }

    function addSamples(this: ProfilerBuilder<Args>, samples: number | number[]) {
        typeNarrowPush<number>(samples, sampleList)
        return this
    }

    function build () {
        return {
            run: () => {
                let result: Stats[] = []
                funcList.forEach(func => {
                    inputList.forEach(input => {
                        sampleList.forEach(sampleSize => {
                            result.push(createStats(func, input, sampleSize))
                        })
                    })
                })
                return result
            },
            $params: {
                funcList,
                inputList,
                sampleList,
                units,
            }
        }
    }


    function removeFuncs(this: ProfilerBuilder<Args>, indices: number | number[]) {
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

    function removeInputs(this: ProfilerBuilder<Args>, indices: number | number[]) {
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

    function removeSamples(this: ProfilerBuilder<Args>, indices: number | number[]) {
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

    function setFuncs(this: ProfilerBuilder<Args>, funcs: Func<Args>[]) {
        funcList = funcs
        return this
    } 

    function setInputs(this: ProfilerBuilder<Args>, inputs: Input<Args>[]) {
        inputList = inputs
        return this
    } 

    function setSamples(this: ProfilerBuilder<Args>, samples: number[]) {
        sampleList = samples
        return this
    } 

    function setUnits(this: ProfilerBuilder<Args>, value: Units) {
        units = value
        return this
    }

    function createStats(func: Func<Args>, input: Input<Args>, sampleSize: number): Stats {
        const times: number[] = []
        for (let j = 0; j < sampleSize; j++) {
            const t0 = performance.now()
            const clonedInput = structuredClone(input.args)
            func(...clonedInput)
            times.push(performance.now() - t0)
        }
        let mean = times.reduce((a: number, v: number) => a + v, 0) / times.length
        const squaredDiffs = times.map(t => (t - mean)**2)
        let sigmaSquared = squaredDiffs.reduce((a: number, v: number) => a + v, 0) / times.length
        mean = convertFromMilliseconds(mean, units)
        sigmaSquared = convertFromMilliseconds(sigmaSquared, units)

        return {
            funcName: func.name,
            inputName: input.name,
            samples: sampleSize,
            mean,
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