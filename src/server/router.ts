import {t} from './trpc'
import { onboardingRouter } from './routers/onboardingRouter';
import { bookRouter } from './routers/bookRouter'
import { movieRouter } from './routers/movieRouter'

export const serverRouter = t.mergeRouters(onboardingRouter, bookRouter, movieRouter)

export type IServerRouter = typeof serverRouter;