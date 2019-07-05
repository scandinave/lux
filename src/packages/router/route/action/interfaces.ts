

import Request from '../../../request';
import Response from '../../../response';

export type Action<T> = (request: Request, response: Response) => Promise<T>;
