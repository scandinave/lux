

import { FreezeableMap, FreezeableSet } from '../index'

describe('module "freezeable"', () => {
  describe('class FreezeableMap', () => {
    describe('#constructor()', () => {
      let subject

      beforeAll(() => {
        subject = new FreezeableMap([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ])
      })

      test('returns a mutable `Map` interface', () => {
        expect(subject.size).toBe(3)

        subject.clear()
        expect(subject.size).toBe(0)

        subject.set('a', 1).set('b', 2).set('c', 3)
        expect(subject.size).toBe(3)

        subject.set('d', 4)
        expect(subject.size).toBe(4)

        subject.delete('d')
        expect(subject.size).toBe(3)
      })
    })

    describe('#freeze()', () => {
      let subject

      beforeEach(() => {
        const d = {
          a: 1,
          b: 2,
          c: 3
        }

        subject = new FreezeableMap([
          ['a', 1],
          ['b', 2],
          ['c', 3],
          ['d', d]
        ])
      })

      test('returns `this`', () => {
        expect(subject.freeze()).toBe(subject)
      })

      test('is immutable after #freeze is called', () => {
        subject.freeze()

        subject.clear()
        expect(subject.size).toBe(4)

        subject.set('a', 1).set('b', 2).set('c', 3)
        expect(subject.size).toBe(4)

        subject.set('d', 4)
        expect(subject.size).toBe(4)

        subject.delete('d')
        expect(subject.size).toBe(4)

        expect(Object.isFrozen(subject.get('d'))).toBe(false)
      })

      test('can recursively freeze members when `deep = true`', () => {
        subject.freeze(true)
        expect(Object.isFrozen(subject.get('d'))).toBe(true)
      })
    })
  })

  describe('class FreezeableSet', () => {
    describe('#constructor()', () => {
      let subject

      beforeAll(() => {
        subject = new FreezeableSet([1, 2, 3])
      })

      test('returns a mutable `Set` interface', () => {
        expect(subject.size).toBe(3)

        subject.clear()
        expect(subject.size).toBe(0)

        subject.add(1).add(2).add(3)
        expect(subject.size).toBe(3)

        subject.add(4)
        expect(subject.size).toBe(4)

        subject.delete(4)
        expect(subject.size).toBe(3)
      })
    })

    describe('#freeze()', () => {
      let subject

      const obj = {
        a: 1,
        b: 2,
        c: 3
      }

      beforeEach(() => {
        subject = new FreezeableSet([1, 2, 3, obj])
      })

      test('returns `this`', () => {
        expect(subject.freeze()).toBe(subject)
      })

      test('is immutable after #freeze is called', () => {
        subject.freeze()

        expect(subject.size).toBe(4)

        subject.clear()
        expect(subject.size).toBe(4)

        subject.add(1).add(2).add(3)
        expect(subject.size).toBe(4)

        subject.add(4)
        expect(subject.size).toBe(4)

        subject.delete(4)
        expect(subject.size).toBe(4)

        subject.forEach(member => {
          if (typeof member === 'object') {
            expect(Object.isFrozen(member)).toBe(false)
          }
        })
      })

      test('can recursively freeze members when `deep = true`', () => {
        subject.freeze(true)
        subject.forEach(member => {
          if (typeof member === 'object') {
            expect(Object.isFrozen(member)).toBe(true)
          }
        })
      })
    })
  })
})
