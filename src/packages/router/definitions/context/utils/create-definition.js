/* @flow */

import { Route } from '../../../index'
import { normalizeName, normalizePath } from '../../../namespace'
import type { Method } from '@lux/packages/request'
import type { Router$Namespace, Route$type } from '../../../index' // eslint-disable-line max-len, no-duplicate-imports

type Define = (name: string, action?: string) => void

type Options = {
  type: Route$type,
  method: Method,
  namespace: Router$Namespace,
}

const createDefinition = ({ type, method, namespace }: Options): Define => (
  name,
  action = normalizeName(name),
) => {
  const normalized = normalizeName(name)
  const { controller } = namespace
  let { path } = namespace

  if (type === 'member') {
    path += `/:id/${normalized}`
  } else {
    path += `/${normalized}`
  }

  path = normalizePath(path)

  const opts = {
    type,
    path,
    action,
    method,
    controller,
  }

  namespace
    .add(new Route(opts))
    .add(
      new Route({
        ...opts,
        type: 'custom',
        method: 'HEAD',
        action: 'preflight',
      }),
    )
    .add(
      new Route({
        ...opts,
        type: 'custom',
        method: 'OPTIONS',
        action: 'preflight',
      }),
    )
}

export default createDefinition
