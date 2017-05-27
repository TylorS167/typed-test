import { Test } from './types'

export function padNewLines(amount: number) {
  return function(str: string): string {
    let padding = ''

    for (let i = 0; i < amount; ++i)
      padding += ' '

    return str.replace(/(\n)/g, '\n' + padding)
  }
}

export const isTest = (x: any): x is Test<any> => !!x['@@typed/test']
