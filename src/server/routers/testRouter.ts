import { initTRPC, TRPCError } from "@trpc/server";
import { hash } from "argon2";

import { IContext } from "../context";
import { signUpSchema, keywords } from "../../common/validation/authSchemas";
import { Prisma } from "@prisma/client";

const t = initTRPC.context<IContext>().create();

export const serverRouter = t.router({
  getBooks: t.procedure
  .query(async ({input, ctx}) => {
    const findBook = await prisma?.userJoinBook.findMany({
      where: {
        userId: ctx.prisma.user.findFirst.findFirst({
          where: { email },
        });
    })
  }),
  addToLibrary: t.procedure 
    .mutation(async ({input, ctx }) => {

       const add = await ctx.prisma.userJoinBook.
      //get book id, find the user from context, make add an entry to bookOnUser
      const exists = await ctx.prisma.use.findFirst({
        where: {  },
      });

     // const result = await ctx.prisma.userJoinbook.create({
     //   data: { username, email, password: hashedPassword },
     // });

      return {
        status: 201,
        message: "Book added to Library for"+ + " successfully",
        result: result.email,
      };
    }),
  rateFromLibrary: t.procedure
  .mutation(),

});

export type IServerRouter = typeof serverRouter;
