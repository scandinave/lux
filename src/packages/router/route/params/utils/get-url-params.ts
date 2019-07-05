

import Parameter from '../parameter'
import { ParameterLike } from '../interfaces'

/**
 * @private
 */
export default function getURLParams(
  dynamicSegments: Array<string>
): Array<[string, ParameterLike]> {
  return dynamicSegments.map(param => [param, new Parameter({
    path: param,
    required: true
  })])
}
