

import { posix } from 'path'

import { deepFreezeProps } from '../../freezeable'
import { closestAncestor } from '../../loader'
import { tryCatchSync } from '../../../utils/try-catch'
import Database from '../../database'
import Controller from '../../controller'
import Serializer from '../../serializer'
import { Bundle$Namespace } from '../../loader' // eslint-disable-line max-len, no-duplicate-imports

export default function createController<T: Controller>(
  constructor: Class<T>,
  opts: {
    key: string;
    store: Database;
    parent: ?Controller;
    serializers: Bundle$Namespace<Serializer<*>>;
  }
): T {
  const { key, store, serializers } = opts
  const namespace = posix.dirname(key).replace('.', '')
  let { parent } = opts
  let model = tryCatchSync(() => store.modelFor(posix.basename(key)))
  let serializer = serializers.get(key)

  if (!model) {
    model = null
  }

  if (!parent) {
    parent = null
  }

  if (!serializer) {
    serializer = closestAncestor(serializers, key)
  }

  const instance: T = Reflect.construct(constructor, [{
    model,
    namespace,
    serializer
  }])

  if (serializer) {
    if (!instance.filter.length) {
      instance.filter = [...serializer.attributes]
    }

    if (!instance.sort.length) {
      instance.sort = [...serializer.attributes]
    }
  }

  if (parent) {
    instance.beforeAction = [
      ...parent.beforeAction.map(fn => fn.bind(parent)),
      ...instance.beforeAction.map(fn => fn.bind(instance))
    ]

    instance.afterAction = [
      ...instance.afterAction.map(fn => fn.bind(instance)),
      ...parent.afterAction.map(fn => fn.bind(parent))
    ]
  }

  Reflect.defineProperty(instance, 'parent', {
    value: parent,
    writable: false,
    enumerable: true,
    configurable: false
  })

  return deepFreezeProps(instance, true,
    'query',
    'sort',
    'filter',
    'params',
    'beforeAction',
    'afterAction'
  )
}
