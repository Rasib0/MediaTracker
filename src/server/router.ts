import {t} from './trpc'
import { onboardingRouter } from './routers/onboardingRouter';
import { bookRouter } from './routers/bookRouter'


export const serverRouter = t.mergeRouters(onboardingRouter, bookRouter)
export type IServerRouter = typeof serverRouter;