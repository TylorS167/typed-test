import * as bodyParser from 'body-parser'
import * as express from 'express'

import { cross, tick } from 'typed-figures'

import { Result } from '../../types'
import { tempDir } from '../tempDir'

export function createServer(
  log: (message: string) => any,
  result: (result: Result) => any
): express.Express {
  const server = express()

  server.use(express.static(tempDir.name))
  server.use(bodyParser.json())

  server.post('/log', (request: express.Request, response: express.Response) => {
    log(request.body)

    response.end()
  })

  server.post('/end-server', (request: express.Request, response: express.Response) => {
    response.send()

    const { body } = request

    const numberOfFailedTests = parseFloat(body['failed'])
    const numberOfPassingTests = parseFloat(body['passed'])

    const toString = () =>
      body['toString']
        .replace(/âœ”/g, tick)
        .replace(/âœ/g, cross + ' ')
        .replace(/(\n)/, '\n  ')

    const errors = () => '  ' + body['errors'].replace(/âœ/g, cross + ' ')

    const report = () => ({ failed: numberOfFailedTests, passed: numberOfPassingTests })

    result({ toString, errors, report })
  })

  return server
}
