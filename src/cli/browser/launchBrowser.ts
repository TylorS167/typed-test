import { PORT } from './constants'

const browserLauncher = require('james-browser-launcher')

export function launchBrowser() {
  const url = `http://localhost:${PORT}`

  return new Promise((resolve, reject) => {
    browserLauncher((err: Error, launch: any) => {
      if (err) return reject(err)

      launch(
        url,
        {
          browser: process.env.BROWSER || 'chrome',
          options: [`--disable-gpu`],
        },
        (error: Error, instance: any) => {
          process.on('exit', () => {
            instance.stop()
          })

          if (error) return reject(error)

          console.log('Browser started with PID:', instance.pid)
          resolve()
        }
      )
    })
  })
}
