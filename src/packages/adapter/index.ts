

import Application from '../application'
import Request from '../request'
import Response from '../response'

export type Adapter = (...args: Array<any>) => Promise<[Request, Response]>
export type AdapterFactory = (application: Application) => Adapter

export { default as http } from './http'
export { default as mock } from './mock'
