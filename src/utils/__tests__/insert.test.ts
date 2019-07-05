

import insert from '../insert'

describe('util insert()', () => {
  test('inserts elements into an `Array` in place', () => {
    const subject = new Array(3)

    insert(subject, [1, 2, 3])

    expect(subject).toEqual([1, 2, 3])
  })

  test('returns the destination `Array`', () => {
    const subject = new Array(3)

    expect(insert(subject, [1, 2, 3])).toBe(subject)
  })
})
