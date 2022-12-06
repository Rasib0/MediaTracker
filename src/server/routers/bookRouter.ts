import { bookRouterNoUser } from './bookRouters/bookRouterNoUser';
import { bookRouterUser } from './bookRouters/bookRouterUser';
import { mergeRouters } from '../trpc';

export const bookRouter = mergeRouters(bookRouterUser, bookRouterNoUser)
