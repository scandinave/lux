

import Controller from '../controller';
import Serializer from '../serializer';
import { Model } from '../database';
import { FreezeableMap } from '../freezeable';

export type Loader = (type: string) => any;
export type Bundle$Namespace<T> = FreezeableMap<string, T>;
export type Bundle$NamespaceGroup<T> = FreezeableMap<
  string,
  Bundle$Namespace<T>
>;
