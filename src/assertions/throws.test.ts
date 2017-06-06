import * as assert from 'assert'

import { throws } from './throws'

describe(`throws`, () => {
  describe(`given a function that throws`, () => {
    it(`returns the error`, () => {
      const err = throws(() => {
        throw new Error(`Foo`)
      })

      assert.strictEqual(err.message, `Foo`)
    })
  })

  describe(`given a function that does not throw`, () => {
    it(`throws an error`, () => {
      try {
        throws(() => {})
        throw new Error(`Function should not throw`)
      } catch (e) {
        assert.strictEqual(e.message, `Did not throw`)
      }
    })
  })
})
