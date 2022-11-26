import {t} from '../trpc'
import { bookRouterNoUser } from './bookRouters/bookRouterNoUser';
import { bookRouterUser } from './bookRouters/BookRouterUser';

export const bookRouter = t.mergeRouters(bookRouterUser, bookRouterNoUser)
