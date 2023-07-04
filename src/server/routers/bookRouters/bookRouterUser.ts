import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { any, number, string } from "zod";
import { mergeRouters, router, publicProcedure, middleware } from '../../trpc';


export const bookRouterUser = router({


  addBookReview: publicProcedure //
    .input(z.object({
      book_url: string(),
      review: string().min(0).max(500)
    }))
    .mutation(async ({ input, ctx }) => { //TODO: should be a mutation
      const { book_url, review } = input

      const Book = await ctx.prisma.book.findFirst({     // check if the book exist in library 
        where: {
          book_url: book_url,
        }
      })

      if (!Book) {     // else throw error
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found. Can't review",
        });
      }
      const result = await ctx.prisma.userJoinBook.update({
        where: {
          userId_bookId: {
            userId: Number(ctx.session?.user.userId) || -1,
            bookId: Book.id
          }
        },
        data: {
          Review: review
        },
        select: {
          Review: true
        }
      })

      return {
        status: 201,
        message: "update successful successful",
        review: result.Review
      }
    }),

  addBookRating: publicProcedure //
    .input(z.object({
      book_url: string(),
      rating: number().min(0).max(5)
    }))
    .mutation(async ({ input, ctx }) => { //TODO: should be a mutation
      const { book_url, rating } = input
      const Book = await ctx.prisma.book.findFirst({     // check if the book exist in library 
        where: {
          book_url: book_url,
        }
      })

      if (!Book) {     // else throw error
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found. Can't rate",
        });
      }
      const result = await ctx.prisma.userJoinBook.update({
        where: {
          userId_bookId: {
            userId: Number(ctx.session?.user.userId) || -1,
            bookId: Book.id
          }
        },
        data: {
          Rating: rating
        },
        select: {
          Rating: true
        }
      })

      return {
        status: 201,
        message: "update successful successful",
        rating: result.Rating
      }
    }),


  addToBookLibrary: publicProcedure //
    .input(z.object({
      book_url: string()
    }
    ))
    .mutation(async ({ input, ctx }) => {
      const { book_url } = input

      const Book = await ctx.prisma.book.findFirst({
        where: {
          book_url: book_url
        }
      })

      if (!Book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }

      const alreadyExist = await ctx.prisma.userJoinBook.findFirst({
        where: {
          userId: Number(ctx.session?.user.userId) || 0,
          book: Book
        }
      })

      if (alreadyExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User's library already has this book",
        });
      }
      const result = await ctx.prisma.userJoinBook.create({
        data: {
          user: {
            connect: {
              email: String(ctx.session?.user.email)
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


  fetchBookFromLibrary: publicProcedure //return the exits in library variable and the rating
    .input(z.object({
      book_url: string(),
      data: any()
    }
    ))
    .query(async ({ input, ctx }) => {
      const { book_url } = input

      const Book = await ctx.prisma.book.findFirst({ //find the id for the book
        where: {
          book_url: book_url
        },
        select: {
          id: true,
          book_url: true
        }
      })

      if (!Book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Book not found",
        });
      }

      const result = await ctx.prisma.userJoinBook.findFirst({
        where: {
          userId: Number(ctx.session?.user.userId) || 0,
          bookId: Book.id
        },
      })

      if (result) {
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
  AllBookInLibrarySortedRecentFav: publicProcedure //TODO: add a keyword search
    .input(z.object({
      keyword: string(),
      data: any(),
      take: number()
    }))
    .query(async ({ input, ctx }) => {
      const { keyword, take } = input

      const booksInLibrary = await ctx.prisma.userJoinBook.findMany({
        take: take,
        where: {
          userId: Number(ctx.session?.user.userId) || -1,
          Rating: 5,
          book: {
            name: {
              contains: keyword,
              mode: 'insensitive'
            },
          }
        },
        select: {
          bookId: true,
          Rating: true,
          assignedAt: true,
          book: {
            select: {
              image_url: true,
              book_url: true,
              name: true,
              synopsis: true,
              author: true,
            },
          }
        },
        orderBy: {
          bookId: 'desc',
        },
      })

      return {
        message: "Listed all books in user library in recently added",
        result: booksInLibrary,
      }
    }),

  AllBookInLibrarySortedRecent: publicProcedure //TODO: use the keyword search
    .input(z.object({
      keyword: string(),
      data: any(),
      take: number()
    }))
    .query(async ({ input, ctx }) => {
      const { keyword, take } = input

      const booksInLibrary = await ctx.prisma.userJoinBook.findMany({
        take: take,
        where: {
          userId: Number(ctx.session?.user.userId) || -1,
          book: {
            name: {
              contains: keyword,
              mode: 'insensitive'
            }
          }
        },
        select: {
          bookId: true,
          Rating: true,
          assignedAt: true,
          book: {
            select: {
              image_url: true,
              book_url: true,
              name: true,
              synopsis: true,
              author: true,
            },
          }
        },
        orderBy: {
          bookId: 'desc',
        },
      })

      return {
        message: "Listed all books in user library in recently added",
        result: booksInLibrary,
      }
    }),

  removeBookFromLibrary: publicProcedure //
    .input(z.object({
      book_url: string()
    }
    ))
    .mutation(async ({ input, ctx }) => { //should be a  mutation
      const { book_url } = input


      const Book = await ctx.prisma.book.findFirst({
        where: {
          book_url: book_url
        },
        select: {
          id: true,
          book_url: true
        }
      })

      if (!Book) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Book not found at the url ${book_url}`,
        });
      }

      try {
        const result = await ctx.prisma.userJoinBook.delete({
          where: {
            userId_bookId: {
              userId: Number(ctx.session?.user.userId) || -1,
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
