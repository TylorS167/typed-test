import { MapLike } from 'typescript'
import { resolveAliases } from './resolveAliases'

const moduleAlias: ModuleAlias = require('module-alias')

interface ModuleAlias {
  (path?: string): void
  addPath(path: string): void
  addAliases(config: Record<string, string>): void
  addAlias(alias: string, path: string): void
}

export function configureAliases(
  fileNames: ReadonlyArray<string>,
  paths: MapLike<Array<string>>,
  baseUrl: string
): void {
  const aliases = resolveAliases(fileNames, paths, baseUrl)

  for (const [aliasName, resolvedPath] of aliases) moduleAlias.addAlias(aliasName, resolvedPath)
}
