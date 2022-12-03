import {t} from '../trpc'
import { bookRouterNoUser } from './bookRouters/bookRouterNoUser';
import { bookRouterUser } from './bookRouters/bookRouterUser';

export const bookRouter = t.mergeRouters(bookRouterUser, bookRouterNoUser)
