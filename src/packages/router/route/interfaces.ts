

import Controller from '../../controller';
import { Method } from '../../request';

export type Route$type =
  | 'custom'
  | 'member'
  | 'collection';

export type Route$opts = {
  type: Route$type;
  path: string;
  action: string;
  method: Method;
  controller: Controller;
};
