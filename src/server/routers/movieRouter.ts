import { movieRouterNoUser } from './movieRouters/movieRouterNoUser';
import { movieRouterUser } from './movieRouters/movieRouterUser';
import { mergeRouters } from '../trpc';

export const movieRouter = mergeRouters(movieRouterUser, movieRouterNoUser)
