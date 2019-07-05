

import faker from 'faker'

import { MIME_TYPE } from '../../jsonapi'
import Controller from '../index'
import Serializer from '../../serializer'
import * as Adapters from '../../adapter'
import noop from '../../../utils/noop'
import { getTestApp } from '../../../../test/utils/test-app'

const HOST = 'localhost:4000'
const DEFAULT_FIELDS = {
  posts: [
    'body',
    'title',
    'createdAt',
    'updatedAt',
  ],
  users: [
    'id',
  ],
  images: [
    'id',
  ],
  comments: [
    'id',
  ],
  reactions: [
    'id',
  ],
  tags: [
    'id',
  ],
}

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post
    let subject
    let adapter
    let app

    const getDefaultProps = () => ({
      id: expect.anything(),
      title: expect.any(String),
      isPublic: expect.any(Boolean),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })

    const assertRecord = (item, props = getDefaultProps()) => {
      expect(item).toBeInstanceOf(Post)

      if (item instanceof Post) {
        expect(item.toObject()).toEqual(
          expect.objectContaining(props)
        )
      }
    }

    beforeAll(async () => {
      app = await getTestApp()
      Post = app.store.modelFor('post')
      adapter = Adapters.mock(app)
      subject = new Controller({
        model: Post,
        namespace: '',
        serializer: new Serializer({
          model: Post,
          parent: null,
          namespace: ''
        })
      })

      subject.controllers = app.controllers
    })

    afterAll(async () => {
      await app.destroy()
    })

    describe('#index()', () => {
      const mockArgs = async (query = '') => {
        const [request, response] = await adapter({
          url: `/posts${query}`,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        })

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: DEFAULT_FIELDS,
          page: {
            size: 25,
            number: 1,
          },
        })

        return [request, response]
      }

      test('returns an array of records', async () => {
        const [request] = await mockArgs()
        const result = await subject.index(request)

        expect(result).toBeInstanceOf(Array)
        result.forEach(item => assertRecord(item))
      })

      test('supports specifying page size', async () => {
        const [request] = await mockArgs('?page[size]=10')
        const result = await subject.index(request)

        expect(result).toBeInstanceOf(Array)
        expect(result).toHaveLength(10)
        result.forEach(item => assertRecord(item))
      })

      test('supports filter parameters', async () => {
        const [request] = await mockArgs('?filter[is-public]=false')
        const result = await subject.index(request)

        expect(result).toBeInstanceOf(Array)
        result.forEach(item => {
          assertRecord(item, {
            ...getDefaultProps(),
            isPublic: false,
          })
        })
      })

      test('supports sparse field sets', async () => {
        const [request] = await mockArgs('?fields[posts]=id,title')
        const result = await subject.index(request)

        expect(result).toBeInstanceOf(Array)
        result.forEach(item => {
          const { id, title } = getDefaultProps()

          assertRecord(item, {
            id,
            title,
          })
        })
      })

      test('supports eager loading relationships', async () => {
        const [request] = await mockArgs('?include=user')
        const result = await subject.index(request)

        expect(result).toBeInstanceOf(Array)
        result.forEach(item => {
          assertRecord(item, {
            ...getDefaultProps(),
            user: expect.objectContaining({
              id: expect.anything(),
              name: expect.any(String),
              email: expect.any(String),
            }),
          })
        })
      })
    })

    describe('#show()', () => {
      const mockArgs = async (id, query = '') => {
        const [request, response] = await adapter({
          url: `/posts/${id}${query}`,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        })

        Object.assign(request.params, {
          id,
        })

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        })

        return [request, response]
      }

      test('returns a single record', async () => {
        const [request] = await mockArgs(1)

        assertRecord(await subject.show(request))
      })

      test('throws an error if the record is not found', async () => {
        const [request] = await mockArgs(10000)

        await subject
          .show(request)
          .catch(err => {
            expect(err).toEqual(expect.any(Error))
          })
      })

      test('supports sparse field sets', async () => {
        const { id, title } = getDefaultProps()
        const [request] = await mockArgs(
          1,
          '?fields[posts]=id,title'
        )

        assertRecord(await subject.show(request), {
          id,
          title,
        })
      })

      test('supports eager loading relationships', async () => {
        const [request] = await mockArgs(1, '?include=user')

        assertRecord(await subject.show(request), {
          ...getDefaultProps(),
          user: expect.objectContaining({
            id: expect.anything(),
            name: expect.any(String),
            email: expect.any(String),
          }),
        })
      })
    })

    describe('#create()', () => {
      let result

      const mockArgs = async params => {
        const [request, response] = await adapter({
          url: '/posts',
          method: 'POST',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: noop,
        })

        Object.assign(request.params, params)

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        })

        return [request, response]
      }

      afterEach(async () => {
        await result.destroy()
      })

      test('returns the newly created record', async () => {
        const title = '#create() Test'
        const isPublic = true
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title,
              isPublic,
            },
          },
          include: [
            'user',
          ],
        })

        result = await subject.create(request, response)

        assertRecord(result, {
          ...getDefaultProps(),
          title,
          isPublic,
        })
      })

      test('sets `response.statusCode` to the number `201`', async () => {
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test',
            },
          },
        })

        result = await subject.create(request, response)

        expect(response.statusCode).toBe(201)
      })

      test('sets the correct `Location` header', async () => {
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test',
            },
          },
        })

        result = await subject.create(request, response)

        expect(
          response.headers.get('location')
        ).toBe(`http://${HOST}/posts/${result.getPrimaryKey()}`)
      })
    })

    describe('#update()', () => {
      let User
      let Comment
      let record

      const getDefaultParams = () => ({
        type: 'posts',
        data: {
          attributes: {
            title: '#update() Test',
          },
        },
      })

      const mockArgs = async (id, params = getDefaultParams()) => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'PATCH',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: noop,
        })

        Object.assign(request.params, params, {
          id,
        })

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        })

        return [request, response]
      }

      beforeEach(async () => {
        User = app.store.modelFor('user')
        Comment = app.store.modelFor('comment')
        record = await Post
          .create({ title: '#update() Test' })
          .then(post => post.unwrap())
      })

      afterEach(async () => {
        await record.destroy()
      })

      test('returns a record if attribute(s) change', async () => {
        const id = record.getPrimaryKey()
        const isPublic = true
        const [request] = await mockArgs(id, {
          type: 'posts',
          data: {
            attributes: {
              isPublic,
            },
          },
        })

        // $FlowIgnore
        expect(record.isPublic).toBe(!isPublic)
        assertRecord(await subject.update(request), {
          ...getDefaultProps(),
          id,
          isPublic,
        })
      })

      test('returns a record if relationships(s) change', async () => {
        const id = record.getPrimaryKey()

        const newUser = await (async () => {
          const result = await User.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8),
          })

          return result.unwrap()
        })()

        const newComment = await (async () => {
          const result = await Comment.create({
            message: faker.lorem.sentence(),
          })

          return result.unwrap()
        })()

        const [request] = await mockArgs(id, {
          type: 'posts',
          data: {
            relationships: {
              user: {
                data: {
                  id: newUser.getPrimaryKey(),
                  type: 'users',
                },
              },
              comments: {
                data: [
                  {
                    id: newComment.getPrimaryKey(),
                    type: 'comments',
                  },
                ],
              },
            },
          },
        })

        const [user, comments] = await Promise.all([
          // $FlowIgnore
          record.user,
          // $FlowIgnore
          record.comments,
        ])

        expect(user).toBeNull()
        expect(comments).toEqual([])

        await subject.update(request)

        record = await Post
          .find(id)
          .include('user', 'comments')

        assertRecord(record, {
          ...getDefaultProps(),
          id,
          user: expect.objectContaining(
            newUser.getAttributes('id', 'name', 'email')
          ),
          comments: expect.arrayContaining([
            expect.objectContaining(
              newComment.getAttributes('id', 'message')
            ),
          ]),
        })

        await Post.transaction(trx => (
          Promise.all([
            newUser
              .transacting(trx)
              .destroy(),
            newComment
              .transacting(trx)
              .destroy(),
          ])
        ))
      })

      test('returns the number `204` if no changes occur', async () => {
        const [request] = await mockArgs(record.getPrimaryKey())

        expect(await subject.update(request)).toBe(204)
      })

      test('throws an error if the record is not found', async () => {
        const [request] = await mockArgs(10000)

        await subject
          .update(request)
          .catch(err => {
            expect(err).toEqual(expect.any(Error))
          })
      })

      test('supports sparse field sets', async () => {
        const id = record.getPrimaryKey()

        const newUser = await (async () => {
          const result = await User.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8),
          })

          return result.unwrap()
        })()

        const [request] = await mockArgs(id, {
          type: 'posts',
          data: {
            relationships: {
              user: {
                data: {
                  id: newUser.getPrimaryKey(),
                  type: 'users',
                },
              },
            },
          },
          fields: {
            users: [
              'id',
              'name',
              'email',
            ],
          },
          include: [
            'user',
          ],
        })

        const [user, comments] = await Promise.all([
          // $FlowIgnore
          record.user,
          // $FlowIgnore
          record.comments,
        ])

        expect(user).toBeNull()
        expect(comments).toEqual([])

        assertRecord(await subject.update(request), {
          ...getDefaultProps(),
          id,
          user: expect.objectContaining(
            newUser.getAttributes(
              'id',
              'name',
              'email'
            )
          ),
        })

        await newUser.destroy()
      })
    })

    describe('#destroy()', () => {
      let record

      const mockArgs = async id => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'DELETE',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        })

        Object.assign(request.params, {
          id,
        })

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        })

        return [request, response]
      }

      beforeAll(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        })
      })

      test('returns the number `204` if the record is destroyed', async () => {
        const [request] = await mockArgs(record.getPrimaryKey())

        expect(await subject.destroy(request)).toBe(204)
      })

      test('throws an error if the record is not found', async () => {
        const [request] = await mockArgs(10000)

        await subject
          .destroy(request)
          .catch(err => {
            expect(err).toEqual(expect.any(Error))
          })
      })
    })

    describe('#preflight()', () => {
      const mockArgs = async () => {
        const [request, response] = await adapter({
          url: '/posts',
          method: 'OPTIONS',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        })

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: DEFAULT_FIELDS,
          page: {
            size: 25,
            number: 1,
          },
        })

        return [request, response]
      }

      test('returns the number `204`', async () => {
        await mockArgs()

        expect(await subject.preflight()).toBe(204)
      })
    })
  })
})
