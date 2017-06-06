import * as assert from 'assert'

import { TestResult } from '../types'
import { blue } from 'typed-colors'
import { describe as describeTest } from './describe'
import { it as itTest } from './it'

describe(`describe`, () => {
  describe(`given a string representing what it's testing and an array of tests`, () => {
    it(`returns a TestCollection`, () => {
      const test = itTest('foo', () => {})
      const testCollection = describeTest(`Foo`, [test])

      assert.ok(testCollection.hasOwnProperty('name'))
      assert.ok(testCollection.hasOwnProperty('tests'))
      assert.ok(typeof testCollection.run === 'function')
    })

    describe(`run`, () => {
      it(`returns TestResults`, () => {
        const test = itTest(`foo`, () => {})
        const testCollection = describeTest(`Foo`, [test])

        return testCollection.run(2000).then(({ passed, results }) => {
          assert.strictEqual(passed, false)

          const foo = results[`${blue('it')} foo`] as TestResult

          assert.strictEqual(foo.passed, false)
          assert.strictEqual(foo.error && foo.error.message, `No assertions have been made`)
        })
      })

      describe(`given another test collection`, () => {
        it(`returns nested TestResults`, () => {
          const testCollection = describeTest(`Foo`, [
            describeTest(`Bar`, [
              itTest(`foobar`, ({ ok }) => {
                ok(true)
              }),
            ]),
          ])

          return testCollection.run(2000).then(({ passed, results }) => {
            assert.strictEqual(passed, true)

            assert.deepEqual(results, {
              [`${blue('Describe')} Bar`]: {
                passed: true,
                results: { [`${blue('it')} foobar`]: { passed: true, error: void 0 } },
              },
            })
          })
        })
      })
    })
  })
})
