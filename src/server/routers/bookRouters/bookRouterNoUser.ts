import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as z from "zod";
import { any, number, string } from "zod";
import {searchSchema, searchBookSchema } from "../../../common/validation/authSchemas";

export const bookRouterNoUser = t.router({
  
  searchBooks: t.procedure
  .input(searchBookSchema)
  .query(async ({input, ctx}) => {
    const { keywords } = input

    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM Book 
                 WHERE book_url like ${keywords}`
      )

      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  findBookData: t.procedure
  .input(z.object({
    book_url: string()
  }))
  .query(async ({input, ctx}) => {
    const { book_url } = input

    const result = await ctx.prisma.book.findFirst({
      where: {
        book_url: book_url
      }
    })

      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  searchBooksOfTags: t.procedure // take a set of tags and keyword as input and return the books corresponding to them
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input

    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT DISTINCT tagId FROM TagJoinBook
                 WHERE tagId in (${ Prisma.join(tags)}) ` //TODO: AND book_url like ${keywords}, need to make this only include the books where all the tags match
      )
        // tags
        // find books with those those tag

    
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  AllBooksSorted: t.procedure //TODO: add a keyword search
  .input(z.object({
   //dbook_url: string(),
   data: any()
   }))
  .query(async ({input, ctx}) => { 
    const {} = input
    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
    }

  const booksInLibrary = await ctx.prisma.userJoinBook.findMany({
    where: {
      userId: Number(ctx.session.user.userId),
    },
    select: {
        bookId: true,
        Rating: true,
        book:{ 
          select: {
            image_url: true,
            book_url: true,
            name: true
          },
        }
    }
  })

    return {
      message: "Listed all books in user library in recently added",
      result: booksInLibrary,
    }
  }),

});
