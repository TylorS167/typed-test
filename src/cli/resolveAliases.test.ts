import { Test } from '@base/types'
import { describe } from '@base/describe'
import { given } from '@base/given'
import { it } from '@base/it'
import { join } from 'path'
import { resolveAliases } from './resolveAliases'
import { tempDir } from './tempDir'

export const test: Test = describe(`resolveAliases`, [
  given(`[ "src/it.test.ts" ], { "@base/*": [ "./src/*" ] }, current working directory`, [
    it(`returns [ [ "@base", "/path/to/temp-dir" ]`, ({ equal }) => {
      const fileNames = ['src/it.test.ts']
      const paths = {
        '@base/*': ['./src/*'],
      }
      const baseUrl = process.cwd()

      const [[aliasName, path]] = resolveAliases(fileNames, paths, baseUrl)

      equal('@base', aliasName)
      equal(join(baseUrl, tempDir.name), path)
    }),
  ]),

  given(`[ "src/it.test.ts" ], {}, current working directory`, [
    it(`returns []`, ({ equal }) => {
      const fileNames = ['src/it.test.ts']
      const paths = {}
      const baseUrl = process.cwd()

      equal([], resolveAliases(fileNames, paths, baseUrl))
    }),
  ]),

  given(`[ "src/it.test.ts" ], { "@base/*": [ "./src/*" ] }, ""`, [
    it(`returns []`, ({ equal }) => {
      const fileNames = ['src/it.test.ts']
      const paths = {
        '@base/*': ['./src/*'],
      }
      const baseUrl = ''

      equal([], resolveAliases(fileNames, paths, baseUrl))
    }),
  ]),

  given(`[ "src/it.test.ts" ], { "@base/*": [ "*" ] }, source directory`, [
    it(`returns [ [ "@base", "/path/to/temp-dir" ]`, ({ equal }) => {
      const cwd = process.cwd()
      const fileNames = [join(cwd, 'src/it.test.ts')]
      const paths = {
        '@base/*': ['*'],
      }
      const baseUrl = join(cwd, 'src')

      const [[aliasName, path]] = resolveAliases(fileNames, paths, baseUrl)

      equal('@base', aliasName)
      equal(join(cwd, tempDir.name), path)
    }),
  ]),

  given(`[ "src/it.test.ts", "test/test.ts" ], { "@base/*": [ "src/*" ] }, source directory`, [
    it(`returns [ [ "@base", "/path/to/temp-dir" ]`, ({ equal }) => {
      const cwd = process.cwd()
      const fileNames = [join(cwd, 'src/it.test.ts'), join(cwd, 'test/test.ts')]
      const paths = {
        '@base/*': ['src/*'],
      }
      const baseUrl = join(cwd, 'src')

      const [[firstAliasName, firstPath]] = resolveAliases(fileNames, paths, baseUrl)

      equal('@base', firstAliasName)
      equal(join(cwd, tempDir.name, 'src'), firstPath)
    }),
  ]),
])
