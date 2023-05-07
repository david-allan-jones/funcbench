# [funcbench](https://www.npmjs.com/package/funcbench)
`funcbench` is a TypeScript library that helps you measure the performance of functions by executing them with different inputs and sample sizes. The main goal of the profiler is to provide developers with a tool for identifying performance bottlenecks and understanding the performance characteristics of their code, and to do while providing type safety for the entire lifespan.

## **Features**
- Profile multiple functions with different input arguments
- Customize the number of samples per function and input
- Calculate mean execution time, variance, and standard deviation
- Choose between multiple time units (e.g., milliseconds, microseconds, nanoseconds)
- Chainable builder pattern for easy configuration

## **Installation**
To use the funcbench profiler, simply import the profiler function from the library:

```typescript
import { profiler } from 'path/to/funcbench';
```
## **Usage**
To create a new profiler, call the `profiler` function and chain the builder methods to configure it:

```typescript
const addNumbers = (a: number, b: number) => a + b

const myProfiler = profiler<[number, number]()
    .addFuncs(addNumbers)
    .addInputs({ name: '0 and 1', args: [0, 1] })
    .addSamples(100)
    .setUnits('ms')
    .build();
```
You can also pass an optional configuration object to the `profiler` function for initial settings:

```typescript
const myProfiler = profiler<[number, number]({
    functions: [addNumbers],
    inputs: [{ name: '0 and 1', args: [0, 1] }],
    samples: [100],
    units: 's'
});
```
Then, run the profiler to get the results:

```javascript
const results = myProfiler.run();
```
The results variable will contain an array of performance statistics for each function, input, and sample size combination. The first index of the array corresponds to the index of the function, the second to the input argument, and the third to the sample size.

## **API Reference** 

### `profiler<Args>(options?: BuilderOptions<Args>)`

Creates a new `ProfilerBuilder` object. The optional `BuilderOptions` object can be used to set the initial configuration:

| Property Name | Type                  | Description                                                               |
|---------------|-----------------------|---------------------------------------------------------------------------|
| `functions`     | `Array<Function>`       | The functions to profile.                                                 |
| `inputs`        | `Array<{ name: string, args: Args }>`    | The input arguments for each function. Each input must be given a name. This will appear in the output to make the results more human readable.                                    |
| `samples`       | `Array<number>`         | The number of samples to run for each function and input combination.     |
| `units`         | `'ns'` \| `'ms'` \| `'s'`                 | The time units to use for the results (e.g., `'ms'` for milliseconds). Defaults to `'ms'`      |

### `ProfilerBuilder`

The profiler builder exposes several chainable methods for configuring the profiler:

| Method Name       | Parameters                                | Description                                                                               |
|-------------------|-------------------------------------------|-------------------------------------------------------------------------------------------|
| `addFuncs`          | `funcs: Function \| Function[]`             | Add one or more functions to the profiler.                                               |
| `addInputs`         | `inputs: Input<Args> \| Input<Args>[]`      | Add one or more input argument sets to the profiler.                                     |
| `addSamples`        | `samples: number \| number[]`               | Add one or more sample sizes to the profiler.                                            |
| `build`             | none                                      | Build and return the configured profiler instance.                                       |
| `removeFuncs`       | `indices: number \| number[]`               | Remove one or more functions from the profiler by their indices.                         |
| `removeInputs`      | `indices: number \| number[]`               | Remove one or more input argument sets from the profiler by their indices.               |
| `removeSamples`     | `indices: number \| number[]`               | Remove one or more sample sizes from the profiler by their indices.                      |
| `setFuncs`          | `funcs: Function[]`                         | Set the functions to profile.                                                            |
| `setInputs`         | `inputs: Input<Args>[]`                     | Set the input arguments for each function.                                               |
| `setSamples`       | `samples: number[]`                         | Set the number of samples to run for each function and input combination.                |
| `setUnits`          | `units: 'ns'` \| `'ms'` \| `'s'`                              | Set the time units to use for the results (e.g., 'ms' for milliseconds).                |

### `Profiler`

The profiler instance, once built, exposes the following methods:

| Method Name | Parameters | Description                                  |
|-------------|------------|----------------------------------------------|
| `run`         | none       | Runs the profiler and returns the results as a `ProfilerResult` object. |

## **Contact**

If you have any questions for me, feel free to contact me through [my website](https://www.davidjonesdev.com/contact).
