# edge-ts

[![Build Status](https://travis-ci.org/acaprojects/edge-ts.svg?branch=master)](https://travis-ci.org/acaprojects/edge-ts)
[![Code Climate](https://codeclimate.com/github/acaprojects/edge-ts/badges/gpa.svg)](https://codeclimate.com/github/acaprojects/edge-ts)
[![Dependencies Status](https://david-dm.org/acaprojects/edge-ts/status.svg)](https://david-dm.org/acaprojects/edge-ts)
[![npm version](https://badge.fury.io/js/edge-ts.svg)](https://badge.fury.io/js/edge-ts)

Strongly typed .NET bindings with Node.js. In-process interop powered by the awesome [edge.js](https://github.com/tjanczuk/edge).

## Usage

### 1. Get the package

    npm install --save edge-ts

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

