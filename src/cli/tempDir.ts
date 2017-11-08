import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'

export const tempDir = { name: `.typed-test-${makeId()}` }

try {
  fs.mkdirSync(path.join(process.cwd(), tempDir.name))

  const cleanup = () => rimraf.sync(tempDir.name)

  process.on('SIGINT', () => {
    cleanup()
    process.exit(1)
  })

  process.on('exit', cleanup)
} catch {}

function makeId(): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 6; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}
