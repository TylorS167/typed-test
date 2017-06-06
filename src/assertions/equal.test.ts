import * as assert from 'assert'

import { equal } from './equal'

describe(`equal`, () => {
  describe(`given an expected and actual value`, () => {
    it(`returns the actual value if assertion is true`, () => {
      const expected = { a: 1 }
      const actual = { a: 1 }

      assert.strictEqual(equal(expected, actual), actual)
    })

    it(`throws an AssertionError if assertion is false`, () => {
      const expected = { a: 1 }
      const actual = { a: 2 }

      try {
        equal(expected, actual)
        throw new Error(`Should throw error`)
      } catch (e) {
        assert.strictEqual(e.message, `Expected value is not equal to actual value`)
      }
    })
  })
})
