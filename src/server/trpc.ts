import { initTRPC} from "@trpc/server";
import { IContext } from "./context";

export const t = initTRPC.context<IContext>().create();
