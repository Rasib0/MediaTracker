import { initTRPC } from "@trpc/server";
import { IContext } from "./context";

import { dataRouter } from "./routers/dataRouter";
import { authRouter } from "./routers/authRouter";

export const t = initTRPC.context<IContext>().create();
// the main router that is the merged of the two routers
const serverRouter = t.mergeRouters(dataRouter, authRouter)

export type IServerRouter = typeof serverRouter;
