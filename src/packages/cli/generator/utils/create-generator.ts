

import { join as joinPath } from 'path'

import chalk from 'chalk'

import { rmrf, exists, mkdirRec, writeFile, parsePath } from '../../../fs'
import { Generator, Generator$template } from '../index'

import log from './log'

const FORWARD_SLASH = /\//g

/**
 * @private
 */
export default function createGenerator({
  dir,
  template,
  hasConflict = exists
}: {
  dir: string;
  template: Generator$template;
  hasConflict?: (path: string) => Promise<boolean>;
}): Generator {
  return async ({ cwd, attrs, onConflict, ...opts }) => {
    const path = parsePath(cwd, dir, `${opts.name}.js`)
    const name = opts.name.replace(FORWARD_SLASH, '-')
    let action = chalk.green('create')

    await mkdirRec(path.dir)

    if (await hasConflict(path.absolute)) {
      const shouldContinue = await onConflict(path.relative)

      if (shouldContinue && typeof shouldContinue === 'string') {
        await rmrf(joinPath(path.dir, shouldContinue))
        log(`${chalk.red('remove')} ${joinPath(dir, shouldContinue)}`)
      } else if (shouldContinue && typeof shouldContinue === 'boolean') {
        action = chalk.yellow('overwrite')
        await rmrf(path.absolute)
      } else {
        log(`${chalk.yellow('skip')} ${path.relative}`)
        return
      }
    }

    await writeFile(path.absolute, Buffer.from(template(name, attrs)))
    log(`${action} ${path.relative}`)
  }
}
