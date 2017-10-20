import { chain, equals, filter, keys, map, pipe, uniq } from '167'
import { dirname, join, relative } from 'path'

import { tempDir } from './tempDir'

const cwd = process.cwd()

export function resolveAliases(
  fileNames: ReadonlyArray<string>,
  paths: Record<string, Array<string>>,
  baseUrl: string
): ReadonlyArray<[string, string]> {
  if (!baseUrl || equals({}, paths)) return []

  const rootFolders = uniq(
    filter<string>(
      pipe(str => str.indexOf('/'), equals(-1)),
      fileNames.map(n => relative(baseUrl, n)).map(dirname)
    )
  )
  const aliases = keys(paths)

  return chain(resolveAlias(paths, rootFolders, baseUrl), aliases)
}

function resolveAlias(
  paths: Record<string, Array<string>>,
  rootFolders: ReadonlyArray<string>,
  baseUrl: string
) {
  const pathCount = keys(paths).length

  return function(alias: string) {
    return map(
      pipe(stripExtraCharacters, modifyPath(pathCount, rootFolders, baseUrl), (path: string): [
        string,
        string
      ] => [stripExtraCharacters(alias), join(cwd, tempDir.name, path)]),
      paths[alias]
    )
  }
}

function stripExtraCharacters(str: string): string {
  return str
    .replace('*', '')
    .replace('./', '')
    .replace(/\/$/, '')
}

function modifyPath(pathCount: number, rootFolders: ReadonlyArray<string>, baseUrl: string) {
  return function(path: string): string {
    if (isBasePath(path)) return relative(cwd, baseUrl)

    const folderIndex = rootFolders.indexOf(path)
    const shouldReplaceFolderPath = folderIndex > -1 || pathCount <= 1

    if (isMultipleCompiledFolders(rootFolders) || !shouldReplaceFolderPath) return path
    if (pathCount > 1) return path

    return path.replace(rootFolders[folderIndex], '')
  }
}

function isBasePath(path: string): boolean {
  return path === '.'
}

function isMultipleCompiledFolders(rootFolders: ReadonlyArray<string>): boolean {
  return rootFolders.length > 1
}
