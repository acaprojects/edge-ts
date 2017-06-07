# edge-ts

[![Build Status](https://travis-ci.org/acaprojects/edge-ts.svg?branch=master)](https://travis-ci.org/acaprojects/edge-ts)
[![Code Climate](https://codeclimate.com/github/acaprojects/edge-ts/badges/gpa.svg)](https://codeclimate.com/github/acaprojects/edge-ts)
[![Dependencies Status](https://david-dm.org/acaprojects/edge-ts/status.svg)](https://david-dm.org/acaprojects/edge-ts)
[![npm version](https://badge.fury.io/js/edge-ts.svg)](https://badge.fury.io/js/edge-ts)

Strongly typed .NET bindings with Node.js.

In-process interop powered by the awesome [edge.js](https://github.com/tjanczuk/edge).

## Usage

### 1. Get the package

```shell
npm install --save edge-ts
```

### 2. Import it

```typescript
import { sync, async, proxy } from 'edge-ts';
```
*Types are bundled with the published package and will be automatically imported.*

### 3. Create your bindings

```typescript
interface InputArgs {
    life: string;
    universe: boolean;
    everything?: SomeOtherType;
}

const meaning = async<InputArgs, number>({
    assemblyFile: 'DeepThought.dll',
    typeName: 'FooBar.MyType',
    methodName: 'MyMethod' // This must be Func<object,Task<object>>
});
```

### 4. Call them as though they were Typscript functions

```typescript
meaning({life: 'test', universe: true, everything: someOtherValue})
    .then(answer => console.log);

// some time passes

=> 42
```

## API

### Binding Targets

Bindings can be created to precompiled libraries (*.dll's) or source to compiled at runtime by edge. Regardless of compile time, the targetted method must be of type `Func<object,Task<object>>`.

#### Source

Simple C# source to be compiled at runtime can be writen inline as a string:

```typescript
const test = async<string, string>(`
    async (input) => { 
        return ".NET Welcomes " + input.ToString(); 
    }
`);
```

Or shifted out to a seperate file:

```typescript
const test = async<string, string>({
    source: 'Foo.cs',
    typeName: 'MyType',             // optional, defualts to 'StartUp'
    methodName: 'MyMethod',         // optional, defaults to 'Invoke'
    references: ['MyOtherLib.dll'], // optional (any external assemblies required)
});
```

#### Precompiled

Precompiled targets take a similar form:

```typescript
const test = async<string, string>({
    assemblyFile: 'MyAssembly.dll',
    typeName: 'MyType',             // optional, defualts to 'StartUp'
    methodName: 'MyMethod',         // optional, defaults to 'Invoke'
    references: ['MyOtherLib.dll'], // optional (any external assemblies required)
});
```

Or if you're happy with the defaults, just the path to the asssembly:

```typescript
const test = async<string, string>('MyAssembly.dll');
```

---


### `async<I, O>(«binding target»)`

Create a asynchronous function, bound to a CLR/.NET Core/Mono method.

The returned function accepts an input (of type `I`) and an (optional) Node style callback (`error: Error | null, result?: O) => void`. Or, if you prefer working with promises, a `Promise<O>` is also returned.

```typescript
const myAsyncBinding = async<number, string>('FooBar.dll');

myAsyncBinding(123)
    .then(doSomething);
    .catch(e => console.log('Oh noes!!!'));

// or

myAsyncBinding(123, (err, result) => {
    if (err) {
        console.log('Oh noes!!!');
    } else {
        doSomething(result);
    }
});
```


### `sync<I, O>(«binding target»)`

Creates a synchronous function, bound to a CLR/.NET Core/Mono method.

The returned function takes a single input argument (or type `I`) and returns an output of type `O`. If the linked method does not return a synchronous result, an Error will be raised.

```typescript
const mySyncBinding = sync<number, string>('FooBar.dll');

doSomthing(mySyncBinding(123));
```

### `proxy<I, O>(«func»)`

Functions may also be passed to the CLR to allow it to call back into Node. These must be of a [specific form expected by edge](https://github.com/tjanczuk/edge#how-to-call-nodejs-from-c). `proxy(..)` may be used to transform a function of type `I => O` into this.

---

For further information on marshalling data between the environments, refer to the [edge.js guide](https://github.com/tjanczuk/edge#how-to-marshal-data-between-c-and-nodejs)