

import createServerError from '../../../../errors/utils/create-server-error'
import stringify from '../../../../utils/stringify'
importof { Model } from '../../../database'

class RecordNotFoundError extends Error {
  constructor({ name, primaryKey }: Model, primaryKeyValue: unknown) {
    super(
      `Could not find ${name} with ${primaryKey} ${stringify(primaryKeyValue)}.`
    )
  }
}

export default createServerError(RecordNotFoundError, 404)
