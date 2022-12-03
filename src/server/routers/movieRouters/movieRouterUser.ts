import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { any, number, string } from "zod";

export const movieRouterUser = t.router({
  

  addMovieReview: t.procedure //
  .input(z.object({
    movie_url: string(),
    review: string().min(0).max(500)
   }))
  .mutation(async ({input, ctx}) => { //TODO: should be a mutation
    const { movie_url, review } = input
    const movie = await ctx.prisma.movie.findFirst({     // check if the movie exist in library 
        where: {
            movie_url: movie_url,
        }
    })
    if(!ctx.session?.user.userId){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found. Can't review",
      });
    }
    
    if(!movie) {     // else throw error
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "movie not found. Can't review",
          });
    }
      const result = await ctx.prisma.userJoinMovie.update({
        where: {
          userId_movieId: {
              userId: Number(ctx.session?.user.userId),
              movieId: movie.id
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

  addMovieRating: t.procedure //
  .input(z.object({
    movie_url: string(),
    rating: number().min(0).max(5)
   }))
  .mutation(async ({input, ctx}) => { //TODO: should be a mutation
    const { movie_url, rating } = input
    const movie = await ctx.prisma.movie.findFirst({     // check if the movie exist in library 
        where: {
            movie_url: movie_url,
        }
    })
    if(!ctx.session?.user.userId){
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found. Can't rate",
      }); 
    }

    if(!movie) {     // else throw error
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "movie not found. Can't rate",
          });
    }
      const result = await ctx.prisma.userJoinMovie.update({
        where: {
          userId_movieId: {
              userId: Number(ctx.session?.user.userId),
              movieId: movie.id
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
  
  
  addMovieToLibrary: t.procedure //
  .input(z.object({
    movie_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { 
    const { movie_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when addToLibrary",
        });
    }
  
    const movie = await ctx.prisma.movie.findFirst({
        where: {
            movie_url: movie_url
        }
    })

    if(!movie) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "movie not found",
        });
  }

  const alreadyExist = await ctx.prisma.userJoinMovie.findFirst({
    where: {
      userId: Number(ctx.session.user.userId),
      movie: movie
    }
  })

  if(alreadyExist) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "User's library already has this movie",
    });
  }
    const result = await ctx.prisma.userJoinMovie.create({
      data: {
        user: {
          connect: {
            email: ctx.session.user.email
          }
        },
        movie: {
          connect: {
            movie_url: movie_url
          }
        },
        Rating: 5,
      }
    })
    
    return {
        message: "created entry in userJoinMovie table",
        result: result,
    }
  }),


  fetchMovieFromLibrary: t.procedure //return the exits in library variable and the rating
  .input(z.object({
    movie_url: string(),
    data: any()
   }
  ))
  .query(async ({input, ctx}) => { 
    const { movie_url } = input
    if(!ctx.session?.user.email) {
      
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when fetchFromLibrary",
        });
    }
  
    const movie = await ctx.prisma.movie.findFirst({ //find the id for the movie
        where: {
            movie_url: movie_url
        },
        select: {
          id: true,
          movie_url: true
        }
    })

    if(!movie) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "movie not found",
        });
  }

  const result = await ctx.prisma.userJoinMovie.findFirst({
    where: {
      userId: Number(ctx.session.user.userId),
      movieId: movie.id
    },
  })

  if(result) {
    return {
      message: "entry exists in userJoinMovie table",
      exists: true,
      result: result,
    }
  }
    return {
      message: "entry doesn't exists in userJoinMovie table",
      exists: false,
      result: result,
    }
  }),

  AllMovieInLibrarySortedRecentFav: t.procedure //TODO: add a keyword search
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

  const moviesInLibrary = await ctx.prisma.userJoinMovie.findMany({
    take: take,
    where: {
      userId: Number(ctx.session.user.userId),
      Rating: 5,
      movie: {
        name: {
          contains: keyword,
          mode: 'insensitive'
        },
      }
    },
    select: {
        movieId: true,
        Rating: true,
        assignedAt: true,
        movie:{ 
          select: {
            image_url: true,
            movie_url: true,
            name: true,
            synopsis: true,
            director: true,
          },
        }
    },
    orderBy: {
      assignedAt: 'asc',
    },
  })

    return {
      message: "Listed all movies in user library in recently added",
      result: moviesInLibrary,
    }
  }),

  AllMovieInLibrarySortedRecent: t.procedure //TODO: use the keyword search
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

  const moviesInLibrary = await ctx.prisma.userJoinMovie.findMany({
    take: take,
    where: {
      userId: Number(ctx.session.user.userId),
      movie: {
        name: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    },
    select: {
        movieId: true,
        Rating: true,
        assignedAt: true,
        movie:{ 
          select: {
            image_url: true,
            movie_url: true,
            name: true,
            synopsis: true,
            director: true,
          },
        }
    },
    orderBy: {
      assignedAt: 'asc',
    },
  })

    return {
      message: "Listed all movies in user library in recently added",
      result: moviesInLibrary,
    }
  }),

  removeMovieFromLibrary: t.procedure //
  .input(z.object({
    movie_url: string()
   }
  ))
  .mutation(async ({input, ctx}) => { //should be a  mutation
    const { movie_url} = input

    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when removeFromLibrary",
        });
    }
  
    const movie = await ctx.prisma.movie.findFirst({
        where: {
            movie_url: movie_url
        },
        select: {
          id: true,
          movie_url: true
        }
    })

    if(!movie) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: `movie not found at the url ${movie_url}`,
        });
  }

  try{
    const result = await ctx.prisma.userJoinMovie.delete({
      where: {
        userId_movieId: {
          userId: Number(ctx.session.user.userId),
          movieId: movie.id
        }
      },
    })
  } catch {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User's library doesn't have ${movie_url}`,
    });
  }
  }),
});
