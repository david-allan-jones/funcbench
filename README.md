# [funcbench](https://www.npmjs.com/package/funcbench)

`funcbench` is a TypeScript library that helps you measure the performance of functions by executing them with different inputs and sample sizes. The main goal of thid library is to provide developers with a tool for identifying performance bottlenecks and understanding the performance characteristics of their code, and to do while providing type safety for the entire lifespan.

## **Features**

- Profile multiple functions with different input arguments
- Customize the number of samples per function and input
- Calculate mean execution time, variance, and standard deviation
- Choose between multiple time units (e.g., seconds, milliseconds and nanoseconds)
- Chainable builder pattern for easy configuration

## **Installation**

To use the funcbench benchmark, first install the package from npm

```bash
npm install funcbench
```

## **Usage**

First import the benchmark function from the library:

```typescript
import { benchmark } from "funcbench";
```

To create a new benchmark, call the `benchmark` function and chain the builder methods to configure it:

```typescript
const addNumbers = (a: number, b: number) => a + b;

const myBenchmark = benchmark<[number, number]>()
  .addFuncs(addNumbers)
  .addInputs({ name: "0 and 1", args: [0, 1] })
  .addSamples(100)
  .setUnits("ms");
```

You can also pass an optional configuration object to the `benchmark` function for initial settings:

```typescript
const myBenchmark = benchmark<[number, number]>({
  functions: [addNumbers],
  inputs: [{ name: "0 and 1", args: [0, 1] }],
  samples: [100],
  units: "s",
});
```

Then, run the benchmark to get the results:

```javascript
const results = myBenchmark.run();
```

The results variable will contain an array of performance statistics for each function, input, and sample size combination.

## **API Reference**

### `benchmark<Args>(options?: BuilderOptions<Args>)`

Creates a new `Benchmark` object. The optional `BuilderOptions` object can be used to set the initial configuration:

### `BuilderOptions<Args>`

| Property Name | Type                                  | Description                                                                                                                                     |
| ------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `functions`   | `Array<Function>`                     | The functions to profile.                                                                                                                       |
| `inputs`      | `Array<{ name: string, args: Args }>` | The input arguments for each function. Each input must be given a name. This will appear in the output to make the results more human readable. |
| `samples`     | `Array<number>`                       | The number of samples to run for each function and input combination.                                                                           |
| `units`       | `'ns'` \| `'ms'` \| `'s'`             | The time units to use for the results (e.g., `'ms'` for milliseconds). Defaults to `'ms'`                                                       |

### `BenchmarkBuilder`

The builder builder exposes several chainable methods for configuring your test:

| Method Name     | Parameters                                                                             | Description                                                                                                                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addFuncs`      | `funcs: Function \| Function[]`                                                        | Add one or more functions to the benchmark.                                                                                                                                                                                                                   |
| `addInputs`     | `inputs: Input<Args> \| Input<Args>[]`                                                 | Add one or more input argument sets to the benchmark.                                                                                                                                                                                                         |
| `addSamples`    | `samples: number \| number[]`                                                          | Add one or more sample sizes to the benchmark.                                                                                                                                                                                                                |
| `removeFuncs`   | `indices: number \| number[]`                                                          | Remove one or more functions from the benchmark by their indices.                                                                                                                                                                                             |
| `removeInputs`  | `indices: number \| number[]`                                                          | Remove one or more input argument sets from the benchmark by their indices.                                                                                                                                                                                   |
| `removeSamples` | `indices: number \| number[]`                                                          | Remove one or more sample sizes from the benchmark by their indices.                                                                                                                                                                                          |
| `run`           | `{ rank`: `boolean \| undefined, testCallback: (stats: Stats) => unknown \| unknown }` | Runs the benchmark and returns the results as a `BenchmarkResult` object. If `rank` is true, then the resulting stats will be sorted with priority in the following order: sample size ascending, input name alphabetic sorting and then mean execution time. |
| `setFuncs`      | `funcs: Function[]`                                                                    | Set the functions to profile.                                                                                                                                                                                                                                 |
| `setInputs`     | `inputs: Input<Args>[]`                                                                | Set the input arguments for each function.                                                                                                                                                                                                                    |
| `setSamples`    | `samples: number[]`                                                                    | Set the number of samples to run for each function and input combination.                                                                                                                                                                                     |
| `setUnits`      | `units: 'ns'` \| `'ms'` \| `'s'`                                                       | Set the time units to use for the results (e.g., 'ms' for milliseconds).                                                                                                                                                                                      |

Once you have set up the benchmark how you want it to be, just call the `run` function and handle the result.

### `BenchmarkResult`

An object that contains an array of `Stats` objects (one for each function/input/sample combination). A `Stats` has the following properties.

| Property Name  | Type     | Description                                                                                                    |
| -------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `funcName`     | `string` | The name of the function passed in. If you passed in an anonymous function, this will be an empty string `""`. |
| `inputName`    | `string` | The string representing the name of the input passed in during the build process.                              |
| `samples`      | `number` | The sample size of this dataset.                                                                               |
| `mean`         | `number` | The mean of all runs of the functions in the sample set for a given input.                                     |
| `sigma`        | `number` | The standard deviation of all runs of the functions in the sample set for a given input.                       |
| `sigmaSquared` | `number` | The variance of all runs of the functions in the sample set for a given input.                                 |

## **Contact**

If you have any questions for me, feel free to contact me through [my website](https://david-allan-jones.github.io/personal-website/).
