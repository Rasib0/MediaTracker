import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Card from "../../components.tsx/card";
import Layout from "../../components.tsx/layout";
import { currentPage } from "~/common/types";
import { LoadingSpinner } from "~/components.tsx/loading";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (_ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const LibraryMovies: NextPage = () => {
  const { data: sessionData } = useSession();

  const {
    data: queryDataRecent,
    isLoading: isLoadingRecent,
    isFetching: isFetchingRecent,
  } = trpc.AllMovieInLibrarySortedRecent.useQuery({
    keyword: "",
    take: 5,
    data: sessionData,
  });

  const {
    data: queryDataFav,
    isLoading: isLoadingFav,
    isFetching: isFetchingFav,
  } = trpc.AllMovieInLibrarySortedRecentFav.useQuery({
    keyword: "",
    take: 5,
    data: sessionData,
  });

  if (!sessionData) {
    return (
      <div className="flex justify-center p-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Layout currentPage={currentPage.library}>
      <div className="flex flex-col items-center p-2">
        <h1 className="text-2xl font-bold">
          <span className="font-mono">{sessionData.user.username}</span>&apos;s
          movie library
        </h1>
        <p>Here is your library where you can see your movie collection!</p>
      </div>

      <h2 className="p-2 text-lg font-semibold">Recently Added</h2>
      <hr className="mb-2" />
      <RecentFeed
        isLoadingRecent={isLoadingRecent}
        isFetchingRecent={isFetchingRecent}
        queryDataFav={{ queryData: queryDataRecent }}
      />
      <h2 className="mt-4 p-2 text-lg font-semibold">Favorites</h2>

      <hr className="mb-2" />
      <FavFeed
        isLoadingFav={isLoadingFav}
        isFetchingFav={isFetchingFav}
        queryDataFav={{ queryData: queryDataFav }}
      />
    </Layout>
  );
};

type FavFeedProps = {
  queryDataFav: {
    queryData:
      | {
          message: string;
          result: {
            movie: {
              name: string;
              image_url: string;
              synopsis: string;
              director: string;
              movie_url: string;
            };
            assignedAt: string;
            Rating: number;
            movieId: number;
          }[];
        }
      | undefined;
  };
  isLoadingFav: boolean;
  isFetchingFav: boolean;
};

const FavFeed = (props: FavFeedProps) => {
  if (props.isLoadingFav || props.isFetchingFav) {
    return (
      <div className="flex justify-center p-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    !props.queryDataFav.queryData ||
    props.queryDataFav.queryData.result.length === 0
  ) {
    return (
      <div className="flex flex-col items-center p-24">
        <div>Not a single movie found in your favourites 😿</div>
        <div>
          Click{" "}
          <Link
            href="/movie/all"
            className="hover:underline dark:text-violet-400"
          >
            here
          </Link>{" "}
          to view our collection instead.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.queryDataFav.queryData.result.map((element, i) => {
        return (
          <Card
            key={i}
            name={element.movie.name}
            type="movies"
            show_author={false}
            rating={element.Rating}
            by={element.movie.director}
            synopsis={element.movie.synopsis}
            date={new Date(element.assignedAt)}
            image_url={element.movie.image_url}
            media_url={element.movie.movie_url}
          />
        );
      })}
    </div>
  );
};

type RecentFeedProps = {
  queryDataFav: {
    queryData:
      | {
          message: string;
          result: {
            movie: {
              name: string;
              image_url: string;
              synopsis: string;
              director: string;
              movie_url: string;
            };
            assignedAt: string;
            Rating: number;
            movieId: number;
          }[];
        }
      | undefined;
  };
  isLoadingRecent: boolean;
  isFetchingRecent: boolean;
};

const RecentFeed = (props: RecentFeedProps) => {
  if (props.isLoadingRecent || props.isFetchingRecent) {
    return (
      <div className="flex justify-center p-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (
    !props.queryDataFav.queryData ||
    props.queryDataFav.queryData.result.length === 0
  ) {
    return (
      <div className="flex justify-center p-24">
        <div>No movies found 🤖</div>
        <div>
          Click{" "}
          <Link
            href="/movies/all"
            className="hover:underline dark:text-violet-400"
          >
            here
          </Link>{" "}
          to view our collection instead.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.queryDataFav.queryData.result.map((element, i) => {
        return (
          <Card
            key={i}
            name={element.movie.name}
            type="movies"
            show_author={false}
            rating={element.Rating}
            by={element.movie.director}
            synopsis={element.movie.synopsis}
            date={new Date(element.assignedAt)}
            image_url={element.movie.image_url}
            media_url={element.movie.movie_url}
          />
        );
      })}
    </div>
  );
};

export default LibraryMovies;
