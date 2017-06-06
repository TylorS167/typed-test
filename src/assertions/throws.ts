export function throws<Err extends Error = Error>(fn: () => any): Err {
  const error = new Error(`Did not throw`)

  try {
    fn()
    throw error
  } catch (e) {
    if (e === error) throw e

    return e
  }
}
