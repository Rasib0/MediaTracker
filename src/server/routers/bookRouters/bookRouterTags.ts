import {searchSchema} from "../../../common/validation/authSchemas";
import { mergeRouters, router, publicProcedure, middleware } from '../../trpc';

// TBD
export const bookRouterTag = router({
  //const c = trpc.searchBooksOfTags.useQuery({ keywords: 'abc', tags: ['fiction', 'fantasy']}) 

  fetchAllBookDataByTagKeyword: publicProcedure // take a set of tags and keyword as input and return the books corresponding to them
  .input(searchSchema)
  .query(async ({input, ctx}) => {
    const { keywords, tags } = input
    
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
      Prisma.sql`SELECT DISTINCT tagId FROM TagJoinBook
                 WHERE tagId in (${ Prisma.join(tags)}) ` //TODO: AND book_url like ${keywords}, need to make this only include the books where all the tags match
      )
      */
        // tags
        // find books with those those tag

    
      return {
        status: 200,
        message: "Search successful",
        result: result
      }
  }),
});
