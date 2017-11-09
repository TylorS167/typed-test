import * as expand from 'glob-expand'
import * as path from 'path'
import * as ts from 'typescript'

import { map } from '167'
import { options } from '../options'
import { resolveAliases } from '../resolveAliases'
import { tempDir } from '../tempDir'

const moduleAlias = require('module-alias')
const cwd = process.cwd()

export function compile(fileNames: ReadonlyArray<string>): ReadonlyArray<string> {
  const { paths = {}, baseUrl = '' } = options
  const aliases = resolveAliases(fileNames, paths, baseUrl)

  for (const [alias, aliasPath] of aliases) moduleAlias.addAlias(alias, aliasPath)

  const program = ts.createProgram(fileNames.slice(), options)
  const emitResult = program.emit()
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')

    console.log(`${diagnostic.file.fileName}\n  (${line + 1},${character + 1}): ${message}`)
  })

  if (emitResult.emitSkipped) process.exit(1)

  return map(
    file => path.join(cwd, file),
    expand({ cwd, filter: 'isFile' }, path.join(tempDir.name, '**/*.js'))
  )
}
