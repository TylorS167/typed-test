import { AssertionError } from './src/assertions/AssertionError'
import { createDiff } from './src/assertions/createDiff'

const expected = { a: 1, b: { c: { d: 6 } } }
const actual = { a: 1, b: { c: { d: 7 } } }

const diff = createDiff(new AssertionError('Items are not equal to each other', expected, actual))

console.log(diff)
