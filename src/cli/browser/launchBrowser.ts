import { PORT } from './constants'

const browserLauncher = require('james-browser-launcher')

export function launchBrowser(keepAlive = false) {
  const url = `http://localhost:${PORT}`

  return new Promise((resolve, reject) => {
    browserLauncher((err: Error, launch: any) => {
      if (err) return reject(err)

      launch(
        url,
        {
          browser: process.env.BROWSER || 'chrome',
          options: [`--disable-gpu`],
          detached: keepAlive,
        },
        (error: Error, instance: any) => {
          if (error) return reject(error)

          if (!keepAlive) {
            process.on('exit', () => {
              instance.stop()
            })
          } else {
            instance.process.unref()
            instance.process.stdin.unref()
            instance.process.stdout.unref()
            instance.process.stderr.unref()
          }

          console.log('Browser started with PID:', instance.pid)
          resolve()
        }
      )
    })
  })
}
