import { Disposable, Scheduler, Sink, Stream } from '@most/types'

import { PORT } from '../cli/browser/constants'
import { ParsedArgs } from '../cli/types'
import { Result } from '../types'
import { buildCompiler } from '../cli/browser/buildCompiler'
import { createServer } from '../cli/browser/createServer'
import { launchBrowser } from '../cli/browser/launchBrowser'

export function runBrowserTests(
  files: Array<string>,
  options: { timeout?: number; keepAlive?: boolean; config?: string } = {
    timeout: 2000,
    keepAlive: false,
  }
): Stream<Result> {
  const args: ParsedArgs = {
    _: files,
    timeout: String(options.timeout || 2000),
    browser: true,
    help: false,
    requires: [],
    config: options.config,
    keepAlive: options.keepAlive,
  }

  function run(sink: Sink<Result>, scheduler: Scheduler): Disposable {
    const event = (result: Result) => sink.event(scheduler.currentTime(), result)

    const server = createServer(console.log, event)
    const compiler = buildCompiler(args, parseFloat(args.timeout))

    const httpServer = server.listen(PORT, '0.0.0.0', () => {
      compiler.watch(
        {
          aggregateTimeout: 300,
          poll: 1000,
        },
        (err: any, stats: any) => {
          logErrors(err, stats)

          launchBrowser(args.keepAlive)
        }
      )
    })

    function dispose() {
      compiler.close()
      httpServer.close()
    }

    return { dispose }
  }

  return { run }
}

function logErrors(err: any, stats: any) {
  if (err) console.error(err.stack)

  const { errors } = stats.toJson()

  if (stats.hasErrors()) errors.forEach(console.error)
}
