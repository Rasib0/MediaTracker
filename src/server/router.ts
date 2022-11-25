import { initTRPC, TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { IContext } from "./context";
import { signUpSchema, searchSchema, searchBookSchema } from "../common/validation/authSchemas";
import { Prisma } from "@prisma/client";
import * as z from "zod";
import { number, string } from "zod";
import book from "../pages/book/[bookurl]";

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

    const result = await prisma?.$queryRaw(
      Prisma.sql`SELECT * FROM Book 
                 WHERE book_url like ${keywords}`
      )

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

    const result = await prisma?.$queryRaw(
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

  searchBookOfUser: t.procedure //TODO: how to get the the current user from context to search the books of that user
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input

    const result = await prisma?.$queryRaw(
      Prisma.sql`SELECT bookId FROM TagJoinBook 
                 WHERE tagId in (${ Prisma.join(tags)}) AND book_url like ${keywords}` //TODO: need to make this only include the books where all the tags match
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
  .mutation(async ({input, ctx}) => {
    const { book_url, rating } = input
    const Book = await prisma?.book.findFirst({     // check if the book exist in library 
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

    const result = await prisma?.userJoinBook.update({
      where: {
        userId: ctx.session.user.userId,
        bookId: Book.bookId,
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
  }),

/**
 *   { data: 
        { 

        }

      }  
      
      
      where: {
            userId: (ctx.session?.user.userId),
            bookId: ,
        }
        data: {
            rating: rating,
        }
 * 
 * 
 * 
 */

  
  addToLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => {
    const { book_url } = input
    const Book = await prisma?.book.findFirst({
        where: {
            book_url: book_url
        }
    })

  if(!ctx.session?.user.email) {
    throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
  }

    if(!Book) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found",
          });
    }

    const result = await prisma?.userJoinBook.create({
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
        status: 201,
        message: "created entry in User Book table",
        result: result
    }
  }),


});

export type IServerRouter = typeof serverRouter;