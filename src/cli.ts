import * as expand from 'glob-expand'
import * as yargs from 'yargs'

import { displayResult } from './displayResult'
import { isTest } from './internal'
import { join } from 'path'
import { map } from '167'

const parsedArgs = yargs
  .usage('Usage: $0 -r [node_module] ...files')
  .alias('r', 'require')
  .argv

if (parsedArgs.help)
  yargs.showHelp()
else {
  if (Array.isArray(parsedArgs.require))
    parsedArgs.require.forEach(require)
  else if (parsedArgs.require)
    // tslint:disable-next-line:no-var-requires
    require(parsedArgs.require)

  const { _: files } = parsedArgs

  const testFiles =
    map((path) => join(process.cwd(), path), expand({ filter: 'isFile' }, files))

  const tests: Array<any> = []

  testFiles.forEach((file) => {
    // tslint:disable-next-line:no-var-requires
    const pkg = require(file)

    if (isTest(pkg))
      tests.push(pkg)

    Object.keys(pkg).forEach((key) => {
      if (isTest(pkg[key]))
        tests.push(pkg[key])
    })
  })

  tests.map(displayResult).forEach((result) => {
    result.then(console.log)
  })
}
