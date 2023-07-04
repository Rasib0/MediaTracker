import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Card from "../../components.tsx/card";
import Layout from "../../components.tsx/layout";
import { currentPage } from "~/common/types";
import { LoadingSpinner } from "~/components.tsx/loading";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (_ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();

  const {
    data: queryDataRecent,
    isLoading: isLoadingRecent,
    isFetching: isFetchingRecent,
  } = trpc.AllBookInLibrarySortedRecent.useQuery({
    keyword: "",
    take: 5,
    data: sessionData,
  });

  const {
    data: queryDataFav,
    isLoading: isLoadingFav,
    isFetching: isFetchingFav,
  } = trpc.AllBookInLibrarySortedRecentFav.useQuery({
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
          Library Page
        </h1>
        <p>Here is your library where you can see your book collection!</p>
      </div>

      <h2 className="p-2 text-lg font-semibold">Recently Added</h2>
      <hr className="mb-2" />
      {(isLoadingRecent || isFetchingRecent) && (
        <div className="flex justify-center p-24">
          <LoadingSpinner />
        </div>
      )}
      {queryDataRecent && queryDataRecent.result.length !== 0 ? (
        <RecentGrid queryData={queryDataRecent} />
      ) : (
        <div>No books found 🤖</div>
      )}

      <h2 className="mt-4 p-2 text-lg font-semibold">Favorites</h2>

      <hr className="mb-2" />
      {(isLoadingFav || isFetchingFav) && (
        <div className="flex justify-center p-24">
          <LoadingSpinner />
        </div>
      )}
      {queryDataFav && queryDataFav.result.length !== 0 ? (
        <FavGrid queryData={queryDataFav} />
      ) : (
        <div>Not a single book found in your favourites 😿</div>
      )}
    </Layout>
  );
};

export default Dashboard;

type Props = {
  queryData: {
    message: string;
    result: {
      book: {
        name: string;
        image_url: string;
        synopsis: string;
        author: string;
        book_url: string;
      };
      assignedAt: string;
      Rating: number;
      bookId: number;
    }[];
  };
};

const FavGrid = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.queryData.result.map((element, i) => {
        return (
          <Card
            key={i}
            name={element.book.name}
            type="books"
            show_author={false}
            rating={element.Rating}
            by={element.book.author}
            synopsis={element.book.synopsis}
            date={new Date(element.assignedAt)}
            image_url={element.book.image_url}
            media_url={element.book.book_url}
          />
        );
      })}
    </div>
  );
};

const RecentGrid = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.queryData.result.map((element, i) => {
        return (
          <Card
            key={i}
            name={element.book.name}
            type="books"
            rating={element.Rating}
            by={element.book.author}
            show_author={false}
            synopsis={element.book.synopsis}
            date={new Date(element.assignedAt)}
            image_url={element.book.image_url}
            media_url={element.book.book_url}
          />
        );
      })}
    </div>
  );
};
