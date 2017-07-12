import { equal } from './assertions/equal'
import { notEqual } from './assertions/notEqual'
import { notOk } from './assertions/notOk'
import { ok } from './assertions/ok'
import { rejects } from './assertions/rejects'
import { same } from './assertions/same'
import { throws } from './assertions/throws'

export type Done = <Err extends Error>(error?: Err) => void

export type TestFn = (assertions: Assertions, done: Done) => any

export interface Assertions {
  readonly equal: typeof equal
  readonly notEqual: typeof notEqual
  readonly notOk: typeof notOk
  readonly ok: typeof ok
  readonly rejects: typeof rejects
  readonly same: typeof same
  readonly throws: typeof throws
}

export interface Stats {
  count: number
}

export interface AssertionEnvironment {
  stats: Stats
  assertions: Assertions
}
