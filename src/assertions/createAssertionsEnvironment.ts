import { AssertionEnvironment, Assertions, Stats } from '../types'

import { equal } from './equal'
import { notEqual } from './notEqual'
import { notOk } from './notOk'
import { ok } from './ok'
import { rejects } from './rejects'
import { same } from './same'
import { throws } from './throws'

export function createAssertionsEnvironment(): AssertionEnvironment {
  const stats: Stats = { count: 0 }

  const assertions: Assertions = {
    equal: wrapAssertionInProxy(equal, stats),
    notEqual: wrapAssertionInProxy(notEqual, stats),
    notOk: wrapAssertionInProxy(notOk, stats),
    ok: wrapAssertionInProxy(ok, stats),
    rejects: wrapAssertionInProxy(rejects, stats),
    same: wrapAssertionInProxy(same, stats),
    throws: wrapAssertionInProxy(throws, stats),
  }

  return { stats, assertions }
}

function wrapAssertionInProxy<A extends Function>(fn: A, stats: Stats): A {
  return new Proxy(fn, {
    apply(target, that, args) {
      stats.count++

      return target.apply(that, args)
    },
  })
}
