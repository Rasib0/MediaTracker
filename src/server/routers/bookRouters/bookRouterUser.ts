import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { any, number, string } from "zod";

export const bookRouterUser = t.router({
  

  addBookReview: t.procedure //
  .input(z.object({
    book_url: string(),
    review: string().min(0).max(500)
   }))
  .mutation(async ({input, ctx}) => { //TODO: should be a mutation
    const { book_url, review } = input
    const Book = await ctx.prisma.book.findFirst({     // check if the book exist in library 
        where: {
            book_url: book_url,
        }
    })
    if(!ctx.session?.user.userId){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found. Can't review",
      });
    }
    
    if(!Book) {     // else throw error
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found. Can't review",
          });
    }
      const result = await ctx.prisma.userJoinBook.update({
        where: {
          userId_bookId: {
              userId: Number(ctx.session?.user.userId),
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
        rating: result.Review
    }
  }),

  addBookRating: t.procedure //
  .input(z.object({
    book_url: string(),
    rating: number().min(0).max(5)
   }))
  .mutation(async ({input, ctx}) => { //TODO: should be a mutation
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

    if(!Book) {     // else throw error
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Book not found. Can't rate",
          });
    }
      const result = await ctx.prisma.userJoinBook.update({
        where: {
          userId_bookId: {
              userId: Number(ctx.session?.user.userId),
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
  
  
  addToBookLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { 
    const { book_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when addToLibrary",
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


  fetchBookFromLibrary: t.procedure //return the exits in library variable and the rating
  .input(z.object({
    book_url: string(),
    data: any()
   }
  ))
  .query(async ({input, ctx}) => { 
    const { book_url } = input
    if(!ctx.session?.user.email) {
      
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when fetchFromLibrary",
        });
    }
  
    const Book = await ctx.prisma.book.findFirst({ //find the id for the book
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
  AllBookInLibrarySortedRecentFav: t.procedure //TODO: add a keyword search
  .input(z.object({
   keyword: string(),
   data: any(),
   take: number()
   }))
  .query(async ({input, ctx}) => { 
    const {keyword, take} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User's email not found in session. Please relogin",
        });
    }

  const booksInLibrary = await ctx.prisma.userJoinBook.findMany({
    take: take,
    where: {
      userId: Number(ctx.session.user.userId),
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
        book:{ 
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
      assignedAt: 'asc',
    },
  })

    return {
      message: "Listed all books in user library in recently added",
      result: booksInLibrary,
    }
  }),

  AllBookInLibrarySortedRecent: t.procedure //TODO: use the keyword search
  .input(z.object({
    keyword: string(),
   data: any(),
   take: number()
   }))
  .query(async ({input, ctx}) => { 
    const {keyword, take} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User's email not found in session. Please re-login",
        });
        
    }

  const booksInLibrary = await ctx.prisma.userJoinBook.findMany({
    take: take,
    where: {
      userId: Number(ctx.session.user.userId),
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
        book:{ 
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
      assignedAt: 'asc',
    },
  })

    return {
      message: "Listed all books in user library in recently added",
      result: booksInLibrary,
    }
  }),

  removeBookFromLibrary: t.procedure //
  .input(z.object({
    book_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { //should be a  mutation
    const { book_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when removeFromLibrary",
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
