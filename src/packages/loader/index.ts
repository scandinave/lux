

import bundleFor from './utils/bundle-for'
import { Loader } from './interfaces'

/**
 * @private
 */
export function createLoader(path: string): Loader {
  let bundle

  return function load(type) {
    if (!bundle) {
      bundle = bundleFor(path)
    }

    return bundle.get(type)
  }
}

export { build } from './builder'
export { closestAncestor, closestChild } from './resolver'

export type {
  Loader,
  Bundle$Namespace,
  Bundle$NamespaceGroup
} from './interfaces'
