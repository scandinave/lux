

import { Model } from '../../database'
import Request from '../../request'
import merge from '../../../utils/merge'
import paramsToQuery from '../utils/params-to-query'
import { getTestApp } from '../../../../test/utils/test-app'

describe('module "controller"', () => {
  describe('util paramsToQuery()', () => {
    let app
    let Post: Class<Model>
    const createParams = (obj: Object): $PropertyType<Request, 'params'> => (
      merge({
        sort: 'createdAt',
        filter: {},
        fields: {
          posts: [
            'body',
            'title',
            'createdAt',
            'updatedAt'
          ]
        }
      }, obj)
    )

    beforeAll(async () => {
      app = await getTestApp()
      Post = app.store.modelFor('post')
    })

    afterAll(async () => {
      await app.destroy()
    })

    test('returns the correct params object', () => {
      const subject = createParams({
        id: 1,
        sort: 'title',
        page: {
          size: 10,
          number: 5
        },
        filter: {
          title: 'New Post'
        },
        fields: {
          posts: [
            'body',
            'title'
          ]
        }
      })

      expect(paramsToQuery(Post, subject)).toMatchSnapshot()
    })

    describe('- page', () => {
      let subject

      beforeEach(() => {
        subject = createParams({
          page: {
            size: 10,
            number: 2
          }
        })
      })

      test('converts `number` and `size` to `page` and `limit`', () => {
        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })
    })

    describe('- sort', () => {
      test('converts asc parameters', () => {
        const subject = createParams({
          sort: 'title'
        })

        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })

      test('converts desc parameters', () => {
        const subject = createParams({
          sort: '-title'
        })

        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })
    })

    describe('- fields', () => {
      test('can properly build included fields', () => {
        const subject = createParams({
          fields: {
            users: [
              'name',
            ],
          },
          include: [
            'user',
          ],
        })

        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })

      test('ignores invalid field sets', () => {
        const subject = createParams({
          fields: {
            authors: [
              'name'
            ]
          },
          include: [
            'author'
          ]
        })

        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })

      test('only adds `id` when the include array is `undefined`', () => {
        const subject = createParams({
          fields: {
            images: [
              'id',
              'url'
            ]
          }
        })

        expect(paramsToQuery(Post, subject)).toMatchSnapshot()
      })
    })
  })
})
