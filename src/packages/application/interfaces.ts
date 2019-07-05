

import { Config } from '../config';
import Database, { Config as DatabaseConfig } from '../database';
import Controller from '../controller';
import Serializer from '../serializer';

export type Application$opts = Config & {
  path: string;
  port: string | number;
  database: DatabaseConfig;
};

export type Application$factoryOpts<T: Controller | Serializer<*>> = {
  key: string;
  store: Database;
  parent: ?T;
};
