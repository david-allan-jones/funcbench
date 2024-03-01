import { Units, convertFromMilliseconds } from "./utils/time";
import { typeNarrowPush, typeNarrowRemove } from "./utils/array";
import {
  BuilderOptions,
  Func,
  Input,
  BenchmarkBuilder,
  Stats,
  BenchmarkRunOptions,
} from "./types/benchmark";
import { statsSort } from "./utils/stats";
import { performance } from "perf_hooks";

const benchmark = <Args extends any[]>(
  options?: BuilderOptions<Args>,
): BenchmarkBuilder<Args> => {
  let funcList: Func<Args>[] = options?.functions ?? [];
  let inputList: Input<Args>[] = options?.inputs ?? [];
  let sampleList: number[] = options?.samples ?? [];
  let units: Units = options?.units ?? "ms";

  function addFuncs(
    this: BenchmarkBuilder<Args>,
    funcs: Func<Args> | Func<Args>[],
  ) {
    typeNarrowPush<Func<Args>>(funcs, funcList);
    return this;
  }

  function addInputs(
    this: BenchmarkBuilder<Args>,
    inputs: Input<Args> | Input<Args>[],
  ) {
    typeNarrowPush<Input<Args>>(inputs, inputList);
    return this;
  }

  function addSamples(
    this: BenchmarkBuilder<Args>,
    samples: number | number[],
  ) {
    typeNarrowPush<number>(samples, sampleList);
    return this;
  }

  function removeFuncs(
    this: BenchmarkBuilder<Args>,
    indices: number | number[],
  ) {
    typeNarrowRemove<Func<Args>>(indices, funcList);
    return this;
  }

  function removeInputs(
    this: BenchmarkBuilder<Args>,
    indices: number | number[],
  ) {
    typeNarrowRemove<Input<Args>>(indices, inputList);
    return this;
  }

  function removeSamples(
    this: BenchmarkBuilder<Args>,
    indices: number | number[],
  ) {
    typeNarrowRemove<number>(indices, sampleList);
    return this;
  }

  function setFuncs(this: BenchmarkBuilder<Args>, funcs: Func<Args>[]) {
    funcList = [...funcs];
    return this;
  }

  function setInputs(this: BenchmarkBuilder<Args>, inputs: Input<Args>[]) {
    inputList = structuredClone(inputs);
    return this;
  }

  function setSamples(this: BenchmarkBuilder<Args>, samples: number[]) {
    sampleList = [...samples];
    return this;
  }

  function setUnits(this: BenchmarkBuilder<Args>, value: Units) {
    units = value;
    return this;
  }

  function createStats(
    sampleSize: number,
    input: Input<Args>,
    func: Func<Args>,
  ): Stats {
    const times: number[] = [];
    for (let j = 0; j < sampleSize; j++) {
      const t0 = performance.now();
      const clonedInput = structuredClone(input.args);
      func(...clonedInput);
      times.push(performance.now() - t0);
    }
    let mean = times.reduce((a: number, v: number) => a + v, 0) / times.length;
    const squaredDiffs = times.map((t) => (t - mean) ** 2);
    let sigmaSquared =
      squaredDiffs.reduce((a: number, v: number) => a + v, 0) / times.length;
    mean = convertFromMilliseconds(mean, units);
    sigmaSquared = convertFromMilliseconds(sigmaSquared, units);

    return {
      samples: sampleSize,
      inputName: input.name,
      funcName: func.name,
      mean,
      sigmaSquared,
      sigma: Math.sqrt(sigmaSquared),
    };
  }

  function run(options?: BenchmarkRunOptions) {
    let result: Stats[] = [];
    sampleList.forEach((sampleSize) => {
      inputList.forEach((input) => {
        funcList.forEach((func) => {
          const stats = createStats(sampleSize, input, func);
          if (options?.testCallback) {
            options.testCallback(stats);
          }
          result.push(stats);
        });
      });
    });
    if (options?.rank) {
      result.sort(statsSort);
    }
    return result;
  }

  return {
    addFuncs,
    addInputs,
    addSamples,
    removeFuncs,
    removeInputs,
    removeSamples,
    run,
    setFuncs,
    setInputs,
    setSamples,
    setUnits,
  };
};

export { benchmark };
