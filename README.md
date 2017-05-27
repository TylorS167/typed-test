# @typed/test

> A simple test runner

## Get it
```sh
yarn add --dev @typed/test
# or
npm install --save-dev @typed/test
```

## Basic usage

```typescript
// no usage of globals
import { describe, given, it } from '@typed/test'
import { strictEqual } from 'assert'

export const add = (x: number, y: number) => x + y

// tests must be exported, but the name is not important
// With bundlers such as Rollup and Webpack2
// These exports will be stripped away by tree-shaking/dead-code-elimination
export const test =
  describe(`add`,
    given(`1 and 2`,
      it(`returns 3`, () => {
        strictEqual(add(1, 2), 3)
      })
    ),

    given(`2 and 2`, () => {
      it(`returns 4`, () => {
        strictEqual(add(2, 2,), 3)
      })
    })
  )
```

Now from your terminal

```sh
# to use with typescript
./node_modules/.bin/test -r ts-node/register src/*.test.ts
# or without any requires
./node_modules/.bin/test src/*.test.js
```

## API

### `describe(name: string, ...tests: Array<Test>): Test`

Describe a collection of tests. Used to create more descriptive test results.

### `given(name: string, ...tests: Array<Test>): Test`

Similar to `describe` -- allows for writing more descriptive test results

### `it<A>(does: string, test: (done: Done) => A | Promise<A>): Test`

The only built-in test function. The `test` callback function is similar to many
test frameworks such a `mocha`. Thrown errors and rejected promises can be used
to signal test failures. Asynchronous test can be dealt with by calling the `done` function
passed into the test function or via a `Promise`.
