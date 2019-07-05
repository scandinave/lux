

import entries from './entries'

/**
 * @private
 */
export default function promiseHash(promises: Object): Promise<Object> {
  if (Object.keys(promises).length) {
    return Promise.all(
      entries(promises)
        .map(([key, promise]: [string, Promise<unknown>]) => (
          new Promise((resolve, reject) => {
            if (promise && typeof promise.then === 'function') {
              promise
                .then((value) => resolve({ [key]: value }))
                .catch(reject)
            } else {
              resolve({ [key]: promise })
            }
          })
        ))
    ).then((objects) => objects.reduce((hash, object) => ({
      ...hash,
      ...object
    }), {}))
  }

  return Promise.resolve({})
}
