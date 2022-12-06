import { onboardingRouter } from './routers/onboardingRouter';
import { bookRouter } from './routers/bookRouter'
import { movieRouter } from './routers/movieRouter'
import { mergeRouters} from './trpc';
export const serverRouter = mergeRouters(onboardingRouter, bookRouter, movieRouter)

export type IServerRouter = typeof serverRouter;