import { green, red } from 'typed-colors'
import { map, range } from '167'

import { Result } from '../types'

export function logResult(result: Result): number {
  const { passed, failed } = result.report()

  console.log()
  console.log('@typed/test -- ' + Date())
  console.log()
  console.log(`  ` + result.toString().trim())

  if (failed > 0 && passed > 0) {
    const separation = map(() => `-`, range(1, 36)).join('')

    console.log()
    console.error(`${separation}${red('Errors')}${separation}`)
    console.error()
    console.error(`  ` + result.errors().trim())
  }

  console.log()
  console.log(`${green(String(passed))} Passing`)
  console.log(`${red(String(failed))} Failing`)

  return failed
}
