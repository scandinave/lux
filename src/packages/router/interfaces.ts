

import Route from './route';
import Controller from '../controller';
import { FreezeableSet } from '../freezeable';

export type Router$opts = {
  controller: Controller;
  controllers: Map<string, Controller>;

  routes(): void;
};

type Router$NS$content =
  | Route
  | Router$Namespace;

export interface Router$Namespace extends FreezeableSet<Router$NS$content> {
  name: string;
  path: string;
  isRoot: boolean;
  namespace: Router$Namespace;
  controller: Controller;
  controllers: Map<string, Controller>;
}
