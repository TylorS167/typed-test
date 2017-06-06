import * as assert from 'assert'

import { it as itTest } from './it'
import { timeout } from './timeout'

describe(`timeout`, () => {
  describe(`given a time and a test`, () => {
    it(`returns a new test that will timeout after a given amount of time`, () => {
      const time = 10
      const test = timeout(
        time,
        itTest(`foo`, ({ ok }, done) => {
          setTimeout(() => {
            ok(true)
            done()
          }, time * 2)
        })
      )

      return test.run(2000).then(({ passed }) => {
        assert.strictEqual(passed, false)
      })
    })
  })
})
