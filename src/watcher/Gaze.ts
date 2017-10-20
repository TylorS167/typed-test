export const Gaze: GazeClass = require('gaze').Gaze

export interface GazeClass {
  new (files: Array<string>, options: GazeOptions): GazeClass

  on(type: 'ready', callback: (watcher: GazeClass) => any): void
  on(type: 'change', callback: (filePath: string) => any): void
  on(type: 'added', callback: (filePath: string) => any): void
  on(type: 'deleted', callback: (filePath: string) => any): void
  on(type: 'error', callback: (error: any) => any): void
  on(type: 'renamed', callback: (newPath: string, oldPath: string) => any): void
  on(type: 'nomatch', callback: () => any): void
  on(type: 'end', callback: () => any): void
  on(type: 'all', callback: (event: string, filePath: string) => any): void

  add(fileGlob: string): void
  remove(fileGlob: string): void
  watched(): Array<string>
  relative(): Array<string>
  close(): void
}

export interface GazeOptions {
  mode?: 'auto' | 'watch' | 'poll'
  cwd?: string
}
