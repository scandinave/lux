

import { exists, readdir, parsePath } from '../../../fs'
import { Generator$opts } from '../index'

export function detectConflict(path: string): Promise<boolean> {
  const { dir, base } = parsePath(path)
  const pattern = new RegExp(`^\\d+-${base.substr(17)}$`)

  return exists(pattern, dir)
}

export function createConflictResolver({ cwd, onConflict }: {
  cwd: Generator$opts['cwd'];
  onConflict: Generator$opts['onConflict'];
}): Generator$opts['onConflict'] {
  return async path => {
    if (await onConflict(path)) {
      const parsed = parsePath(cwd, path)
      const migrations = await readdir(parsed.dir)

      return migrations.find(
        file => file.substr(17) === parsed.base.substr(17)
      ) || false
    }

    return false
  }
}
