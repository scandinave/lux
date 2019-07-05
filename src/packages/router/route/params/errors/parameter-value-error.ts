

import { line } from '../../../../logger'
import createServerError from '../../../../../errors/utils/create-server-error'
import { ParameterLike } from '../index'

/**
 * @private
 */
class ParameterValueError extends TypeError {
  constructor(param: ParameterLike, actual: unknown) {
    super(line`
      Expected value for parameter '${param.path}' to be one of
      [${param.size ? [...param.values()].join(', ') : ''}] but got
      ${actual}.
    `)
  }
}

export default createServerError(ParameterValueError, 400)
