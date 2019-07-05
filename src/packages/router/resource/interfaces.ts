

import Controller, { BuiltInAction } from '../../controller';
import { Namespace$opts } from '../namespace';

export type Resource$opts = Namespace$opts & {
  only: Array<BuiltInAction>;
};
