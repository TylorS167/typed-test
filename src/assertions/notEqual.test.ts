import * as assert from 'assert'

import { notEqual } from './notEqual'

describe(`notEqual`, () => {
  describe(`given an expected and actual value`, () => {
    it(`returns the actual value if assertion is true`, () => {
      const expected = { a: 1 }
      const actual = { a: 2 }

      assert.strictEqual(notEqual(expected, actual), actual)
    })

    it(`throws an AssertionError if assertion is false`, () => {
      const expected = { a: 1 }
      const actual = { a: 1 }

      try {
        notEqual(expected, actual)
        throw new Error(`Should throw error`)
      } catch (e) {
        assert.strictEqual(e.message, `Expected value is equal to actual value`)
      }
    })
  })
})
