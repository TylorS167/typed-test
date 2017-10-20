import { Disposable, Scheduler, Sink, Stream } from '@most/types'
import { flatten, values } from '167'

import { Gaze } from './Gaze'
import { Result } from '../types'
import { multicast } from '@most/core'
import { runBrowserTests } from './runBrowserTests'
import { runNodeTests } from './runNodeTests'
import { statSync } from 'fs'

export function createWatcher(options: Options): Stream<Result> {
  const { browser = false, files, timeout = 2000 } = options

  const results = browser ? runBrowserTests(files, timeout) : new Watcher(options)

  return multicast(results)
}

export type Options = {
  files: Array<string>
  timeout?: number
  browser?: boolean
}

class Watcher implements Stream<Result> {
  constructor(private options: Options) {}

  public run(sink: Sink<Result>, scheduler: Scheduler): Disposable {
    const { files, timeout = 2000 } = this.options

    const event = (result: Result) => sink.event(scheduler.currentTime(), result)
    const error = (err: Error) => sink.error(scheduler.currentTime(), err)

    const gaze = new Gaze(files, { mode: 'watch' })

    function getFiles() {
      const watched = flatten<string>(values(gaze.watched()))

      return watched.filter(filePath => statSync(filePath).isFile())
    }

    const run = () =>
      runNodeTests(getFiles(), timeout)
        .then(event)
        .catch(error)

    gaze.on('ready', run)
    gaze.on('all', run)
    gaze.on('error', error)

    return { dispose: () => gaze.close() }
  }
}
