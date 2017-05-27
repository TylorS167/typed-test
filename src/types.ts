import { Maybe } from '167'

export type Done<E extends Error = Error> = (e?: E) => void

export interface Result {
  readonly name: string,
  readonly passed: boolean,
  readonly error: Maybe<Error>
}

export interface SingularTest {
  readonly '@@typed/test': string
  readonly run: () => Promise<Result>
}

export interface GroupTest {
  readonly '@@typed/test': string,
  readonly tests: Array<Test<any>>
}

export type Test<A> = SingularTest | GroupTest
