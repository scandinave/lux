

import { ANSI } from '../constants'
import stringify from '../../../../utils/stringify'
import { Format } from '../../index'

export default function formatMessage(data?: unknown, format: Format): string {
  if (data instanceof Error) {
    return data.stack
  } else if (format === 'json') {
    return stringify(data).replace(ANSI, '')
  }

  return stringify(data, 2)
}
