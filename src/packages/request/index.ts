

import Logger from '../logger'
import { ObjectMap } from '../../interfaces'

export type URL = {
  protocol?: string;
  slashes?: boolean;
  auth?: string;
  host?: string;
  port?: string;
  hostname?: string;
  hash?: string;
  search?: string;
  query?: any;
  pathname?: string;
  path?: string;
  href: string;
  params: Array<any>;
}

export type Params = ObjectMap<any>

export type Method =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'

export type Options = {
  url: URL;
  params: ObjectMap<any>;
  logger: Logger;
  method: Method;
  headers: Map<string, string>;
  encrypted: boolean;
  defaultParams: ObjectMap<any>;
}

/**
 * @class Request
 * @public
 */
class Request {
  url: URL;
  params: ObjectMap<any>;
  logger: Logger;
  method: Method;
  headers: Map<string, string>;
  encrypted: boolean;
  defaultParams: ObjectMap<any>;

  constructor(options: Options) {
    this.url = options.url;
    this.params = options.url;
    this.logger = options.logger;
    this.method = options.method;
    this.headers = options.headers;
    this.encrypted = options.encrypted;
    this.defaultParams = options.defaultParams;
  }
}

export default Request
export * from './constants'
