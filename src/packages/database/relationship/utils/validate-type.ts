

import isNull from '../../../../utils/is-null'
import { Model } from '../../index'

function validateOne(model: Class<Model>, value: void | ?mixed) {
  return isNull(value) || model.isInstance(value)
}

export default function validateType(model: Class<Model>, value: unknown) {
  if (Array.isArray(value)) {
    return value.every(item => validateOne(model, item))
  }

  return validateOne(model, value)
}
