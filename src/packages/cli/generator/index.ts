import chalk from 'chalk'

import createPrompt from '../utils/create-prompt'

import generatorFor from './utils/generator-for'
import { Generator$opts } from './interfaces'

/**
 * @private
 */
export async function runGenerator({ cwd, type, name, attrs }: {
  cwd: Generator$opts['cwd'];
  type: Generator$opts['type'];
  name: Generator$opts['name'];
  attrs: Generator$opts['attrs'];
}): Promise<void> {
  const generator = generatorFor(type)
  const prompt = createPrompt()

  await generator({
    cwd,
    type,
    name,
    attrs,
    onConflict: path => prompt.question(
      `${chalk.green('?')} ${chalk.red('Overwrite')} ${path}? (Y/n)\r`
    )
  })

  prompt.close()
}

export {
  Generator,
  Generator$opts,
  Generator$template
} from './interfaces'
