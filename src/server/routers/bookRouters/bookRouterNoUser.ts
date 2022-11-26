import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import { Prisma} from "@prisma/client";
import * as z from "zod";
import { any, number, string } from "zod";
import {searchSchema, searchBookSchema } from "../../../common/validation/authSchemas";

export const bookRouterNoUser = t.router({
  
/*

    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM Book 
                 WHERE book_url like ${keywords}`
      )
  */
  fetchAllBookDataByKeywordDesc: t.procedure
  .input(z.object({
    keyword: string(),
    username: string().nullable(),
  }))
  
  .query(async ({input, ctx}) => {
    const { keyword, username} = input
    
    const result = await ctx.prisma.book.findMany({
      orderBy: [
        {
          name: 'desc',
        },
      ],
      where: {
        OR: [ 
          { 
            name: {
              contains: keyword,
            },
          },
          { 
            synopsis: {
              contains: keyword,
            },
          },

        ],
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        book_url: true,
      }
    })
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  fetchSingleBookDataByUrl: t.procedure
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

  AllBooksSorted: t.procedure //TODO: add a keyword search
  .input(z.object({
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
