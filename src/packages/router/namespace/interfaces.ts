

import Controller from '../../controller';
import { Router$Namespace } from '../index';

export type Namespace$opts = {
  name: string;
  path: string;
  namespace?: Router$Namespace;
  controller: Controller;
  controllers: Map<string, Controller>;
};
