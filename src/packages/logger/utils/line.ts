

import { insertValues } from '../../template'

/**
 * @private
 */
export default function line(strings: Array<string>, ...values: Array<unknown>): string {
  return insertValues(strings, ...values)
    .replace(/(\r\n|\n|\r|)/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}
