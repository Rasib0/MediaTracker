import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/layout";
import Card from "../../components.tsx/card";
import { currentPage } from "~/common/types";
import { LoadingSpinner } from "~/components.tsx/loading";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const AllMovies: NextPage = () => {
  const { data: sessionData } = useSession();

  // TODO: fix this, use a single state or another hook or something
  const [searchInput, setSearchInput] = useState("");
  const [searchInputRequest, setsearchInputRequest] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setsearchInputRequest(searchInput);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const {
    data: queryData,
    isFetching,
    isLoading,
  } = trpc.fetchAllMovieDataByKeywordDesc.useQuery({
    keyword: searchInputRequest,
  });

  return (
    <Layout currentPage={currentPage.movies}>
      <div>
        <h1 className="m-2 text-3xl font-bold">
          Every Movie in our Collection!
        </h1>
        <form className="flex justify-center">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            type="search"
            id="search"
            className="m-2 w-full rounded-md border px-2 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            placeholder="Enter a movie name..."
            aria-label="Search"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </form>
        <Feed
          isLoading={isLoading}
          isFetching={isFetching}
          searchInputRequest={searchInputRequest}
          queryDataObj={{ queryData }}
        />
      </div>
    </Layout>
  );
};

type FeedProps = {
  queryDataObj: {
    queryData:
      | {
          message: string;
          status: number;
          result:
            | {
                id: number;
                name: string;
                image_url: string;
                synopsis: string;
                director: string;
                movie_url: string;
              }[];
        }
      | undefined;
  };
  isLoading: boolean;
  isFetching: boolean;
  searchInputRequest: string;
};

const Feed = (props: FeedProps) => {
  if (props.isFetching || props.isLoading)
    return (
      <div className="flex justify-center p-24">
        <LoadingSpinner />
      </div>
    );
  if (
    !props.queryDataObj.queryData ||
    props.queryDataObj.queryData.result.length === 0
  )
    return (
      <div className="flex justify-center p-24">
        <p className="font-mono text-lg dark:text-red-200">
          {`No movies found for the keyword: ${props.searchInputRequest}`}
        </p>
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {props.queryDataObj.queryData.result?.map((movie, i) => {
        return (
          <Card
            key={i}
            name={movie.name}
            type="movies"
            rating={null}
            by={movie.director}
            synopsis={movie.synopsis}
            date={null}
            show_author={false}
            image_url={movie.image_url}
            media_url={movie.movie_url}
          />
        );
      })}
    </div>
  );
};

export default AllMovies;
