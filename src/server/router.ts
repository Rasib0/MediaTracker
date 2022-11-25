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

  // ----------------- SIGN IN PROCEDURES ---------------------
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

    // -------- DATA  PROCEDURES -----------
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

  findBookData: t.procedure
  .input(z.object({
    book_url: string()
  }))
  .query(async ({input, ctx}) => {
    const { book_url } = input

    const result = await prisma?.book.findFirst({
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
/*
    const result = await prisma?.userJoinBook.update({
      where: {
        userId: parseInt(ctx.session?.user.userId),
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
  
    const Book = await prisma?.book.findFirst({
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

  const alreadyExist = await prisma?.userJoinBook.findFirst({
    where: {
      userId: parseInt(ctx.session.user.userId),
      book: Book
    }
  })

  if(alreadyExist) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "User's library already has this book",
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
        message: "created entry in UserJoinBook table",
        result: result,
        Book: Book,
        useremail: ctx.session?.user.email

    }
  }),


  checkInLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .query(async ({input, ctx}) => { 
    const { book_url } = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
    }
  
    const Book = await prisma?.book.findFirst({
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

  const result = await prisma?.userJoinBook.findFirst({
    where: {
      userId: parseInt(ctx.session.user.userId),
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
  else {
    return {
      message: "entry doesn't exists in UserJoinBook table",
      exists: false,
      result: result,
    }
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
  
    const Book = await prisma?.book.findFirst({
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
    const result = await prisma?.userJoinBook.delete({
      where: {
        userId_bookId: {
          userId: parseInt(ctx.session.user.userId),
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

export type IServerRouter = typeof serverRouter;