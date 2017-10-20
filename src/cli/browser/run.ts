import { PORT } from './constants'
import { ParsedArgs } from '../types'
import { buildCompiler } from './buildCompiler'
import { createServer } from './createServer'
import { launchBrowser } from './launchBrowser'
import { logResult } from '../logResult'

export async function run(args: ParsedArgs, timeout: number) {
  const compiler = buildCompiler(args, timeout)
  const server = createServer(console.log, result => process.exit(logResult(result)))

  console.log('Bundling tests with webpack...')
  compiler.run((err: any, stats: any) => {
    logErrors(err, stats)

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Test server running on port ${PORT}`)

      launchBrowser()
    })
  })
}

function logErrors(err: any, stats: any) {
  if (err) {
    console.error(err.stack)

    process.exit(1)
  }

  const { errors } = stats.toJson()

  if (stats.hasErrors()) {
    errors.forEach(console.error)

    process.exit(1)
  }
}
