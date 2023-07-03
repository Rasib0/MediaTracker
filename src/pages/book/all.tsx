import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/layout";
import OverviewCard from "../../components.tsx/card";
import { currentPage } from "~/common/types";
import { LoadingSpinner } from "~/components.tsx/loading";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
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
  } = trpc.fetchAllBookDataByKeywordDesc.useQuery({
    keyword: searchInputRequest,
  });

  return (
    <Layout currentPage={currentPage.books}>
      <div>
        <h1 className="m-2 text-3xl font-bold">
          Every Book in our Collection!
        </h1>
        <input
          type="search"
          id="search"
          className="m-2 w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          placeholder="Enter a book name..."
          aria-label="Search"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      {isFetching || isLoading ? (
        <div className="flex justify-center p-24">
          <LoadingSpinner />
        </div>
      ) : !queryData || queryData.result.length === 0 ? (
        <div className="flex justify-center p-16">
          <p className="font-mono text-lg dark:text-red-200">
            {`No books found for the keyword: ${searchInputRequest}`}
          </p>
        </div>
      ) : (
        <Grid queryData={queryData} />
      )}
    </Layout>
  );
};

type GridProps = {
  queryData: {
    message: string;
    status: number;
    result:
      | {
          id: number;
          name: string;
          image_url: string;
          synopsis: string;
          author: string;
          book_url: string;
        }[];
  };
};
const Grid = (props: GridProps) => {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {props.queryData.result?.map((book, i) => {
        return (
          <OverviewCard
            key={i}
            name={book.name}
            type="books"
            rating={null}
            by={book.author}
            synopsis={book.synopsis}
            date={null}
            show_author={false}
            image_url={book.image_url}
            media_url={book.book_url}
          />
        );
      })}
    </div>
  );
};

export default Dashboard;
