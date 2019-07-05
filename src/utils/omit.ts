

import entries from './entries'
import setType from './set-type'

/**
 * @private
 */
export default function omit<T extends Object>(src: T, ...omitted: Array<string>): T {
  return setType(() => entries(src)
    .filter(([key]) => omitted.indexOf(key) < 0)
    .reduce((result, [key, value]: [string, unknown]) => ({
      ...result,
      [key]: value
    }), {}))
}
