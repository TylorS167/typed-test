import * as assert from 'assert'

import { it as itTest } from './it'
import { strip } from 'typed-colors'

describe(`it`, () => {
  describe(`given a name and test function`, () => {
    it(`returns a Test`, () => {
      const test = itTest(`foo`, () => Promise.resolve(1))

      assert.strictEqual(strip(test.name), 'it foo')
      assert.ok(test.run)
    })

    describe(`run`, () => {
      describe(`given a timeout of 0`, () => {
        it(`returns a test that always fails`, () => {
          const test = itTest(`foo`, ({ ok }, done) => {
            setTimeout(() => {
              ok(true)
              done()
            }, 100)
          })

          return test.run(0).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })
      })

      describe(`given a test that uses no assertions`, () => {
        it(`returns a promise of a failing TestResult`, () => {
          const test = itTest(`foo`, () => {})

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })
      })

      describe(`given a synchronous test that uses assertions`, () => {
        it(`returns a promise of a failing TestResult if assertion throws`, () => {
          const test = itTest(`foo`, ({ ok }) => {
            ok(false)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })

        it(`returns a promise of a passing TestResult if assertion is successful`, () => {
          const test = itTest(`foo`, ({ ok }) => {
            ok(true)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, true)
          })
        })
      })

      describe(`given a promise returning test that uses no assertions`, () => {
        it(`returns a promise of a failed test result`, () => {
          const test = itTest(`foo`, ({ ok }) => {
            Function.prototype(ok)

            return Promise.resolve(1)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })
      })

      describe(`given a promise returning test that uses assertions`, () => {
        it(`returns a promise of a failed test result if assertion is false`, () => {
          const test = itTest(`foo`, ({ ok }) => {
            ok(false)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })

        it(`returns a promise of a passed test result if assertion is true`, () => {
          const test = itTest(`foo`, ({ ok }) => {
            ok(true)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, true)
          })
        })
      })

      describe(`given a promise returning test that uses the done callback`, () => {
        it(`should fail with a warning of using both promises and done callback`, () => {
          const test = itTest(`foo`, ({ ok }, done) => {
            ok(true)

            done()

            return Promise.resolve(1)
          })

          return test.run(100).then(({ passed, error }) => {
            if (!error) throw new Error(`Should fail test`)

            assert.strictEqual(passed, false)

            assert.strictEqual(
              error.message,
              `A promise-returning test should not use 'done' callback`
            )
          })
        })
      })

      describe(`given an async test that uses no assertions`, () => {
        it(`returns a promise of a failed TestResult`, () => {
          const test = itTest(`foo`, () => {})

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, false)
          })
        })
      })

      describe(`given an async test that uses the done callback`, () => {
        it(`returns a promise of a failed TestResult if given an error`, () => {
          const err = new Error(`foo`)

          const test = itTest(`foo`, ({ ok }, done) => {
            setTimeout(() => {
              ok(true)
              done(err)
            }, 0)
          })

          return test.run(100).then(({ passed, error }) => {
            assert.strictEqual(passed, false)
            assert.strictEqual(error, err)
          })
        })

        it(`returns a promise of a passed TestResult if given no error`, () => {
          const test = itTest(`foo`, ({ ok }, done) => {
            setTimeout(() => {
              ok(true)
              done()
            }, 0)
          })

          return test.run(100).then(({ passed }) => {
            assert.strictEqual(passed, true)
          })
        })
      })
    })
  })
})
