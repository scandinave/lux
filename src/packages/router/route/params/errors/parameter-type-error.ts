

import { line } from '../../../../logger'
import createServerError from '../../../../../errors/utils/create-server-error'
import { ParameterLike } from '../index'

/**
 * @private
 */
class ParameterTypeError extends TypeError {
  constructor(param: ParameterLike, actual: string) {
    const { type, path } = param

    super(line`
      Expected type '${type || 'undefined'}' for parameter '${path}' but got
      '${actual}'.
    `)
  }
}

export default createServerError(ParameterTypeError, 400)
