

import Controller from '../../../controller';
import { Route$type } from '../index';
import { Method } from '../../../request';
import { Lux$Collection } from '../../../../interfaces';

export type Params$opts = {
  type: Route$type;
  method: Method;
  controller: Controller;
  dynamicSegments: Array<string>;
};

export type ParameterLike$opts = {
  path: string;
  type?: string;
  values?: Array<any>;
  required?: boolean;
  sanitize?: boolean;
};

export interface ParameterLike extends Lux$Collection<any> {
  path: string;
  type: string;
  required: boolean;
  sanitize: boolean;

  validate<V: any>(value: V): V;
}
