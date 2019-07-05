

import Model, { Model$Hook } from '../index'

/**
 * @private
 */
export default function runHooks(
  record: Model,
  trx: Object,
  ...hooks: Array<void | Model$Hook>
): Promise<void> {
  return hooks
    .filter(Boolean)
    .reduce((prev, next) => (
      prev.then(() => next(record, trx))
    ), Promise.resolve())
}
