import {t} from '../trpc'
import { movieRouterNoUser } from './movieRouters/movieRouterNoUser';
import { movieRouterUser } from './movieRouters/movieRouterUser';

export const movieRouter = t.mergeRouters(movieRouterUser, movieRouterNoUser)
