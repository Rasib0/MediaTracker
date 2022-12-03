import {t} from '../../trpc'
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { any, string } from "zod";

export const movieRouterNoUser = t.router({
  
/*
    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM movie 
                 WHERE movie_url like ${keywords}`
      )
  */
  fetchAllMovieDataByKeywordDesc: t.procedure
  .input(z.object({
    keyword: string(),
  }))
  
  .query(async ({input, ctx}) => {
    const { keyword } = input
    
    const result = await ctx.prisma.movie.findMany({
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
        movie_url: true,
        synopsis: true,
        director: true,
      }
    })
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  fetchSingleMovieDataByUrl: t.procedure
  .input(z.object({
    movie_url: string()
  }))
  .query(async ({input, ctx}) => {
    const { movie_url } = input

    const result = await ctx.prisma.movie.findFirst({
      where: {
        movie_url: movie_url
      }
    })
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),

  AllMoviesSorted: t.procedure //TODO: add a keyword search
  .input(z.object({
    data: any()
   }))
  .query(async ({input, ctx}) => { 

    const {} = input
    if(!ctx.session?.user.email) {
      throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found when AllmoviesSorted",
        });
    }

  const MoviesInLibrary = await ctx.prisma.userJoinMovie.findMany({
    where: {
      userId: Number(ctx.session.user.userId),
    },
    select: {
        movieId: true,
        Rating: true,
        movie:{ 
          select: {
            image_url: true,
            movie_url: true,
            name: true
          },
        }
    }
  })
    return {
      message: "Listed all movies in user library in recently added",
      result: MoviesInLibrary,
    }
  }),

});
