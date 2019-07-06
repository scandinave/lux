

import { MIME_TYPE } from '../../jsonapi'
import { Headers, ResponseHeaders } from '../utils/headers'

describe('module "adapters/headers"', () => {
  let subject: Headers

  describe('util Headers', () => {
    beforeEach(() => {
      subject = new Headers()
    })

    describe('#constructor()', () => {
      beforeEach(() => {
        subject = new Headers({
          Accept: MIME_TYPE,
          'Content-Type': MIME_TYPE,
        })
      })

      test('creates an instance of Headers', () => {
        expect(subject).toMatchSnapshot()
      })
    });

    describe(`#get()`, () => {
        const key = 'Accept'
        const value = true

        beforeEach(() => {
            subject.set(key, MIME_TYPE)
        })

        test('returns the correct value for the given key', () => {
            expect(subject.get(key)).toBe(value)
        })

        test('is not case sensitive', () => {
            expect(subject.get(key.toUpperCase())).toBe(value)
        })
    })

    describe(`#has()`, () => {
        const key = 'Accept'
        const value = MIME_TYPE

        beforeEach(() => {
            subject.set(key, MIME_TYPE)
        })

        test('returns the correct value for the given key', () => {
            const test: (keyof Headers) = 'get';
            expect(subject[test](key)).toBe(value)
        })

        test('is not case sensitive', () => {
            expect(subject.get(key.toUpperCase())).toBe(value)
        })
    })

    describe('#set()', () => {
      const key = 'Accept'
      const value = MIME_TYPE

      test('sets the correct value for the given key', () => {
        expect(subject.set(key, value)).toMatchSnapshot()
      })
    })

    describe('#delete()', () => {
      const key = 'Accept'
      const value = MIME_TYPE

      beforeEach(() => {
        subject.set(key, value)
      })

      test('deletes the entry for a given key', () => {
        subject.delete(key)
        expect(subject.size).toBe(0)
      })

      test('is not case sensitive', () => {
        subject.delete(key.toUpperCase())
        expect(subject.size).toBe(0)
      })
    })
  })

  describe('util ResponseHeaders', () => {
    const key = 'Content-Type'
    const value = MIME_TYPE
    const handleChange = jest.fn()

    beforeEach(() => {
      subject = new ResponseHeaders(handleChange)
    })

    describe('#set()', () => {
      test('calls the change handler', () => {
        subject.set(key, value)
        expect(handleChange).toBeCalledWith('SET', [key, value])
      })
    })

    describe('#delete()', () => {
      test('calls the change handler', () => {
        subject.delete(key)
        expect(handleChange).toBeCalledWith('DELETE', [key, null])
      })
    })
  })
})
