import * as expand from 'glob-expand'
import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

import { map } from '167'
import { tempDir } from '../tempDir'

const cwd = process.cwd()

const configPath = ts.findConfigFile(cwd, (fileName: string) => fs.existsSync(fileName))

const { config: { compilerOptions } } = ts.parseConfigFileTextToJson(
  configPath,
  fs.readFileSync(configPath).toString()
)

const { options } = ts.convertCompilerOptionsFromJson(
  {
    ...compilerOptions,
    module: 'commonjs',
    target: 'es5',
    noEmit: false,
    noEmitOnError: true,
    outDir: tempDir.name,
  },
  cwd
)

export function compile(fileNames: ReadonlyArray<string>): ReadonlyArray<string> {
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
