import { initTRPC, TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { IContext } from "./context";
import { signUpSchema, searchSchema, searchBookSchema } from "../common/validation/authSchemas";
import { Prisma } from "@prisma/client";

const t = initTRPC.context<IContext>().create();

export const serverRouter = t.router({
  signup: t.procedure.input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input;
      // ERROR CHECKS
      const existsEmail = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (existsEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists.",
        });
      }

      const existsUserName = await ctx.prisma.user.findFirst({
        where: { username },
      });

      if (existsUserName) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists.",
        });
      }
      // ACTUAL CODE

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),

    // -------- data procedure -----------
  searchBooks: t.procedure
  .input(searchBookSchema)
  .query(async ({input, ctx}) => {
    const { keywords } = input

    const query = await prisma?.$queryRaw(
      Prisma.sql`SELECT * FROM book WHERE book_url like ${keywords}`
      )
      return {
        query
      }
  }),

  searchBooksOfTags: t.procedure
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input

    const query = await prisma?.$queryRaw(
      Prisma.sql`SELECT bookId FROM TagJoinBook WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` //TODO: need to make this only include the books where all the tags match
      )

    
      return {
        query
      }
  }),

  searchBookOfUser: t.procedure //TODO: how to get the the current user from context to search the books of that user
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input

    const query = await prisma?.$queryRaw(
      Prisma.sql`SELECT bookId FROM TagJoinBook WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` //TODO: need to make this only include the books where all the tags match
      )
    return {
       query
    }
    
  })

});

export type IServerRouter = typeof serverRouter;