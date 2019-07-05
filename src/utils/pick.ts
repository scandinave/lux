

import setType from './set-type'

/**
 * @private
 */
export default function pick<T extends Object>(src: T, ...keys: Array<string>): T {
  return setType(() => keys
    .map((key): [string, unknown] => [key, Reflect.get(src, key)])
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value
    }), {}))
}
