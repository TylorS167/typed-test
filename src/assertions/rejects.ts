import { id } from '167'

export const rejects = <Err extends Error = Error>(promise: Promise<any>): Promise<Err> =>
  promise.then(throwError, id)

function throwError() {
  throw new Error(`Promise did not reject`)
}
