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

    const movie_data = await ctx.prisma.movie.findFirst({
      where: {
        movie_url: movie_url
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        movie_url: true,
        synopsis: true,
        director: true,
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
      message: "Movie found",
      result: movie_data
    }
}),
});
