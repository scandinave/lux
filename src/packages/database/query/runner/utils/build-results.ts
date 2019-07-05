

import { camelize, singularize } from 'inflection'

import Model from '../../../model'
import entries from '../../../../../utils/entries'
import underscore from '../../../../../utils/underscore'
import promiseHash from '../../../../../utils/promise-hash'

/**
 * @private
 */
export default async function buildResults<T: Model>({
    model,
    records,
    relationships
}: {
    model: Class<T>,
    records: Promise<Array<Object>>,
    relationships: Object
}): Promise<Array<T>> {
  const results = await records
  const pkPattern = new RegExp(`^.+\\.${model.primaryKey}$`)
  let related

  if (!results.length) {
    return []
  }

  if (Object.keys(relationships).length) {
    related = entries(relationships)
            .reduce((obj, entry) => {
              const [name, relationship] = entry
              let foreignKey = camelize(relationship.foreignKey, true)

              if (relationship.through) {
                const query = relationship.model.select(...relationship.attrs)

                const baseKey = `${relationship.through.tableName}.` +
                        `${singularize(underscore(name))}_id`

                foreignKey = `${relationship.through.tableName}.` +
                        `${relationship.foreignKey}`

                query.snapshots.push(
                  ['select', [
                    `${baseKey} as ${camelize(baseKey.split('.').pop(), true)}`,
                    `${foreignKey} as ${camelize(foreignKey.split('.')
                        .pop(), true)}`
                  ]],

                  ['innerJoin', [
                    relationship.through.tableName,
                    `${relationship.model.tableName}.` +
                            `${relationship.model.primaryKey}`,
                    '=',
                    baseKey
                  ]],

                  ['whereIn', [
                    foreignKey,
                    results.map(({ id }) => id)
                  ]]
                    )

                return {
                  ...obj,
                  [name]: query
                }
              }

              return {
                ...obj,
                [name]: relationship.model
                        .select(...relationship.attrs)
                        .where({
                          [foreignKey]: results.map(({ id }) => id)
                        })
              }
            }, {})

    related = await promiseHash(related)
  }

  return results.map(record => {
    if (related) {
      entries(related)
                .forEach(([name, relatedResults]: [string, Array<Model>]) => {
                  const relationship = model.relationshipFor(name)

                  if (relationship) {
                    let { foreignKey } = relationship

                    foreignKey = camelize(foreignKey, true)

                    Reflect.set(record, name, relatedResults.filter(({
                            rawColumnData
                        }) => {
                      const fk = Reflect.get(rawColumnData, foreignKey)
                      const pk = Reflect.get(record, model.primaryKey)

                      return fk === pk
                    }))
                  }
                })
    }

    const instance = Reflect.construct(model, [
      entries(record)
                .reduce((r, entry) => {
                  let [key, value] = entry

                  if (value == null && pkPattern.test(key)) {
                    return r
                  } else if (key.indexOf('.') >= 0) {
                    const [a, b] = key.split('.')
                    let parent: ?Object = r[a]

                    if (!parent) {
                      parent = {}
                    }

                    key = a
                    value = {
                      ...parent,
                      [b]: value
                    }
                  }

                  return {
                    ...r,
                    [key]: value
                  }
                }, {})
    ])

    instance.currentChangeSet.persist()

    return instance
  })
}
