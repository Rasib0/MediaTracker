
import {TRPCError } from "@trpc/server";
import { searchSchema } from "../../common/validation/authSchemas";
import { Prisma } from "@prisma/client";
import {t} from '../router'

export const dataRouter = t.router({
    searchBooks: t.procedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
      const { keywords, tags } = input
  
      const query = await prisma?.$queryRaw(
        Prisma.sql`SELECT * from book WHERE book_url like ${keywords}`
        )
    }),
  
    searchBooksOfTags: t.procedure
    .input(searchSchema)
    .query(async ({input, ctx}) => {
      const { keywords, tags } = input
  
      const query = await prisma?.$queryRaw(
        Prisma.sql`SELECT bookId FROM TagJoinBook WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` //TODO: need to make this only include the books where all the tags match
        )
    }),
  
    searchBookOfTagsOfUser: t.procedure //TODO: how to get the the current user from context to search the books of that user
    .input(searchSchema)
    .query(async ({input, ctx}) => {
      const { keywords, tags } = input
  
      const query = await prisma?.$queryRaw(
        Prisma.sql`SELECT bookId FROM TagJoinBook WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` //TODO: need to make this only include the books where all the tags match
        )
    })
  });  