import * as assert from 'assert'

import { rejects } from './rejects'

describe(`rejects`, () => {
  describe(`given a rejects promise`, () => {
    it(`returns a promise containing the error`, () => {
      const promise = Promise.reject(new Error(`foo`))

      return rejects(promise).then((err: Error) => {
        assert.strictEqual(err.message, `foo`)
      })
    })
  })

  describe(`given a resolved promise`, () => {
    it(`returns a rejects promise`, () => {
      const promise = Promise.resolve(1)

      return rejects(promise).then(
        () => {
          throw new Error(`Should not be called`)
        },
        (err: Error) => {
          assert.strictEqual(err.message, `Promise did not reject`)
        }
      )
    })
  })
})
