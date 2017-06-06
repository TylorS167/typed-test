export class AssertionError<A> extends Error {
  public expected: A
  public actual: A
  public message: string

  constructor(message: string, expected: A, actual: A, fn?: Function) {
    super(message)

    this.name = 'AssertionError'
    this.expected = expected
    this.actual = actual

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, typeof fn === 'function' ? fn : AssertionError)
    }
  }
}
