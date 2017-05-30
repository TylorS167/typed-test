import { Test, beforeEach, describe, it } from './'

import { eq } from '@briancavalier/assert'

let i = 0

export const test: Test =
  describe(beforeEach.name,
    beforeEach(
      () => { ++i },

      it(`should run before me`, () => {
        eq(1, i)
      }),

      it(`should run before me, too`, () => {
        eq(2, i)
      }),
    ),
  )
