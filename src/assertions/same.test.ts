import * as assert from 'assert'

import { same } from './same'

describe(`same`, () => {
  describe(`given an expected and actual value`, () => {
    it(`returns actual value if assertion is true`, () => {
      const expected = 2
      const actual = 2

      assert.strictEqual(actual, same(expected, actual))
    })

    it(`throws an error if assert is not true`, () => {
      const expected = 1
      const actual = 2

      try {
        same(expected, actual)
        throw new Error(`Should throw error`)
      } catch (e) {
        assert.strictEqual(e.message, `Expected value is not strictly equal to actual value`)
      }
    })
  })
})
