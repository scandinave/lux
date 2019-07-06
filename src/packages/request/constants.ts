

import { Method } from './index'

export const HAS_BODY: RegExp = /^(?:POST|PATCH)$/i
export const METHODS: Set<Method> = (
  new Set<Method>([
    'GET',
    'HEAD',
    'POST',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ])
)
