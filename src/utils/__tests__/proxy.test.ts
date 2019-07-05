

import * as proxy from '../proxy'

describe('util proxy', () => {
  describe('.trapGet()', () => {
    let base
    let proxied

    class Circle {
      radius: number;

      constructor(radius) {
        this.radius = radius
      }

      get diameter() {
        return this.radius * 2
      }

      area() {
        return Math.PI * (this.radius ** 2)
      }
    }

    beforeEach(() => {
      const traps = {
        isProxied: true,

        shortArea(target) {
          return Math.round(target.area() * 100) / 100
        }
      }

      base = new Circle(10)
      proxied = new Proxy(base, {
        get: proxy.trapGet(traps)
      })
    })

    describe('- properties', () => {
      test('captures and returns values defined in as traps', () => {
        // $FlowIgnore
        expect(proxied.isProxied).toBe(true)
      })

      test('forwards unknown properties to the proxy target', () => {
        expect(proxied.radius).toBe(base.radius)
      })
    })

    describe('- methods', () => {
      test('captures and returns values defined in as traps', () => {
        // $FlowIgnore
        expect(proxied.shortArea()).toBe(314.16)
      })

      test('forwards unknown methods to the proxy target', () => {
        expect(proxied.area()).toBe(base.area())
      })
    })

    describe('#unwrap', () => {
      test('returns the proxy target', () => {
        // $FlowIgnore
        expect(proxied.unwrap()).toBe(base)
      })
    })
  })
})
