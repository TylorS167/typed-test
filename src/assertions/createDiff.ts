import { bold, green, red } from 'typed-colors'

import { AssertionError } from './AssertionError'
import { diffJson } from 'diff'

export function createDiff(assertionError: AssertionError<any>): string {
  const { message, actual, expected } = assertionError

  return (
    bold(`AssertionError: ${message}\n`) +
    `  ${red('- expected')} ${green('+ actual')}\n\n` +
    formatDiff(diffJson(actual, expected))
  )
}

function formatDiff(diffResults: Array<JsDiff.IDiffResult>): string {
  let diffString = '  '

  for (const result of diffResults) {
    if (!result.hasOwnProperty('added') && !result.hasOwnProperty('removed')) {
      diffString += `${result.value}`
    } else {
      const { removed, value } = result

      if (removed) {
        diffString += `${green('+')} ${dropFirstTwoSpaces(value)}`
      } else {
        diffString += `${red('-')} ${dropFirstTwoSpaces(value)}`
      }
    }
  }

  return padNewLine(diffString) + '\n'
}

function padNewLine(str: string): string {
  return str.replace(/(\n)/g, `\n  `)
}

function dropFirstTwoSpaces(str: string): string {
  return str.slice(2)
}
