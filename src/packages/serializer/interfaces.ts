

import Serializer from './index';
import { Model } from '../database';

export type Serializer$opts<T: Model> = {
  model: Class<T>;
  parent: ?Serializer<*>;
  namespace: string;
};
