import {t} from '../../trpc'
import * as z from "zod";
import { string } from "zod";

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
  }))
  
  .query(async ({input, ctx}) => {
    const { keyword } = input
    
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
              mode: "insensitive"
            },
          },
          { 
            synopsis: {
              contains: keyword,
              mode: "insensitive"
            },
          },

        ],
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        book_url: true,
        synopsis: true,
        author: true,
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

    const book_data = await ctx.prisma.book.findFirst({
      where: {
        book_url: book_url
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        book_url: true,
        synopsis: true,
        author: true,
        Users: {
          select: {
            Rating: true,
            Review: true,
            assignedAt: true,
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    })
    return {
      message: "Book found",
      result: book_data
    }
}),
  
});
