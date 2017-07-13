# @typed/test

> A simple test runner

## Get it
```sh
npm install --save-dev @typed/test
# or
yarn add --dev @typed/test
```

## Basic usage

```typescript
// foo.test.ts
import { describe, given, it } from '@typed/test'

function foo(str: string): string {
  return str.replace(/r/g, 'z')
}

// name of export is not important
// only requires a test to be exported
export const fooTest = describe(`foo`, [
  given(`'bar'`, [
    it(`returns 'baz'`, ({ equal }) => {
      equal('baz', foo('bar'))
    })
  ])
])

function bar(): string {
  return 'bar'
}

export const barTest = it(`returns 'bar'`, ({ ok }) => {
  ok(bar() === 'bar')
})
```

Then from your terminal

```sh
./node_modules/.bin/typed-test foo.test.ts

# supports globs
./node_modules/.bin/typed-test *.test.ts
```

## API

#### `describe(what: string, tests: Array<Test | TestCollection>): Test`

Allows creating a collection of tests that are related to one another, useful
for when you have many tests for a class or function.

Supports `.only` modifier to run only a particular test suite.

#### `given(what: string, tests: Array<Test | TestCollection>): Test`

Just like `describe`, but with a nice descriptive name for your tests to read
like natural language.

Supports `.only` modifier to run only a particular test suite.

#### `it(does: string, test: (assertions: Assertions, done: Done) => any): Test`

Allows writing tests that make assertions.

```typescript
import { it } from '@typed/test'

export const testOne =
  it(
    `You must use assertions provided`,
    ({ equal, notEqual, notOk, ok, rejects, same, throws }) => {
      // assertions are counted and if none are called, your test will fail
    },
  )

export const testTwo =
  it(
    `The test function has an optional 'done' callback for async tests`,
    ({ ok }, done) => {
      setTimeout(() => {
        ok(true)
        done() // test is finished
        done(new Error(`Test will fail`))
      })
    }
  )

export const testThree =
  it(
    `Supports the returning of promises`,
    ({ eq }) => Promise.resolve(1).then(eq(1)) // assertions are curried!
  )
```

Supports `.only` modifier to run only a particular test.

#### `timeout(ms: number, tests: Array<Test>): Test`

Allows specifying how long asynchronous tests should run before failing.

```typescript
import { timeout, describe, it } from '@typed/test'

export const testOne = timeout(500, [
  describe(`Foo`, [ ... ])
])

export const testTwo = timeout(10, [
  it('does stuff', ({ ok }) => { ... })
])
```

## Types

```typescript
export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export interface Test {
  only: boolean
  run: (timeout: number) => Promise<TestResult | TestResults>
}

// all assertions are actually curried!
export interface Assertions {
  readonly equal: <A>(expected: A, actual: A): A;
  readonly notEqual: <A>(expected: A, actual: A): A;
  readonly notOk: (actual: boolean): boolean;
  readonly ok: (actual: boolean): boolean;
  readonly rejects: <Err extends Error = Error>(promise: Promise<any>) => Promise<Err>;
  readonly same: <A>(expected: A, actual: A): A;
  readonly throws: <Err extends Error = Error>(fn: () => any): Err
}

```