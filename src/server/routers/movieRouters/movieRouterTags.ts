import {t} from '../../trpc'
import { any, number, string } from "zod";
import {searchSchema} from "../../../common/validation/authSchemas";
// TBD
export const movieRouterTag = t.router({
  //const c = trpc.searchmoviesOfTags.useQuery({ keywords: 'abc', tags: ['fiction', 'fantasy']}) 

  fetchAllmovieDataByTagKeyword: t.procedure // take a set of tags and keyword as input and return the movies corresponding to them
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input
    
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
              contains: keywords,
              mode: 'insensitive', // Default value: default
            },
          },
          { 
            synopsis: {
              contains: keywords,
              mode: 'insensitive', // Default value: default
            },
          },

        ],
        Tags: {
          
        }
      },

    })
    /*
    const result = await ctx.prisma.$queryRaw(
      Prisma.sql`SELECT DISTINCT tagId FROM TagJoinmovie
                 WHERE tagId in (${ Prisma.join(tags)}) ` //TODO: AND movie_url like ${keywords}, need to make this only include the movies where all the tags match
      )
      */
        // tags
        // find movies with those those tag

    
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),
});
