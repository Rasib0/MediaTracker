import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as z from "zod";
import { any, number, string } from "zod";
import {searchSchema} from "../../../common/validation/authSchemas";

export const bookRouterUser = t.router({

  searchBookOfUser: t.procedure //TODO: how to get the the current user from context to search the books of that user
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input

    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT bookId FROM TagJoinBook 
                 WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` 
      )
    return {
        status: 200,
        message: "Search successful",
        result: result
    }
    
  }),
  
  addRatingIfLibrary: t.procedure //
  .input(z.object({
    book_url: string(),
    rating: number().min(0).max(5)
   }))
  .query(async ({input, ctx}) => { //TODO: should be a mutation
    const { book_url, rating } = input
    const Book = await ctx.prisma.book.findFirst({     // check if the book exist in library 
        where: {
            book_url: book_url,
        }
    })
    if(!ctx.session?.user.userId){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found. Can't rate",
      });
    }
    
    if(rating > 5) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Bad rating",
      });
    }

    if(!Book) {     // else throw error
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found. Can't rate",
          });
    }
/*
    const result = await ctx.prisma.userJoinBook.update({
      where: {
        userId: Number(ctx.session?.user.userId),
        book: Book.bookId
      },
      data: {
        Rating: rating
      }
    })

    return {
        status: 201,
        message: "update successful successful",
        result: result
    }
    */
  }),
  
  addToLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { 
    const { book_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
    }
  
    const Book = await ctx.prisma.book.findFirst({
        where: {
            book_url: book_url
        }
    })

    if(!Book) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
  }

  const alreadyExist = await ctx.prisma.userJoinBook.findFirst({
    where: {
      userId: Number(ctx.session.user.userId),
      book: Book
    }
  })

  if(alreadyExist) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "User's library already has this book",
    });
  }
    const result = await ctx.prisma.userJoinBook.create({
      data: {
        user: {
          connect: {
            email: ctx.session.user.email
          }
        },
        book: {
          connect: {
            book_url: book_url
          }
        },
        Rating: 5,
      }
    })
    
    return {
        message: "created entry in UserJoinBook table",
        result: result,
    }
  }),


  checkInLibrary: t.procedure //
  .input(z.object({
    book_url: string(),
    data: any()
   }
  ))
  .query(async ({input, ctx}) => { 
    const { book_url} = input
    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
    }
  
    const Book = await ctx.prisma.book.findFirst({
        where: {
            book_url: book_url
        },
        select: {
          id: true,
          book_url: true
        }
    })

    if(!Book) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
  }

  const result = await ctx.prisma.userJoinBook.findFirst({
    where: {
      userId: Number(ctx.session.user.userId),
      bookId: Book.id
    },
    select: {
      userId: true,
      bookId: true
    }
  })

  if(result) {
    return {
      message: "entry exists in UserJoinBook table",
      exists: true,
      result: result,
    }
  }
    return {
      message: "entry doesn't exists in UserJoinBook table",
      exists: false,
      result: result,
    }
  }),

  AllBookInLibrarySortedRecent: t.procedure //TODO: add a keyword search
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

  removeFromLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { //should be a  mutation
    const { book_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
    }
  
    const Book = await ctx.prisma.book.findFirst({
        where: {
            book_url: book_url
        },
        select: {
          id: true,
          book_url: true
        }
    })

    if(!Book) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: `Book not found at the url ${book_url}`,
        });
  }

  try{
    const result = await ctx.prisma.userJoinBook.delete({
      where: {
        userId_bookId: {
          userId: Number(ctx.session.user.userId),
          bookId: Book.id
        }
      },
    })
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User's library doesn't have ${book_url}`,
    });
  }
  }),
});
