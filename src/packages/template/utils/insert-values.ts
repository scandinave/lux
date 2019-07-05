

/**
 * @private
 */
export default function insertValues(
  strings: Array<string>,
  ...values: Array<unknown>
) {
  if (values.length) {
    return strings.reduce((result, part, idx): string => {
      let value = values[idx]

      if (value && typeof value.toString === 'function') {
        value = value.toString()
      } else {
        value = ''
      }

      return result + part + value
    }, '')
  }

  return strings.join('')
}
