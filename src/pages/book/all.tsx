import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/layout";
import OverviewCard from "../../components.tsx/card";
import { currentPage } from "~/common/types";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchAllBookDataByKeywordDesc =
    trpc.fetchAllBookDataByKeywordDesc.useQuery({
      keyword: searchKeyword,
    });

  return (
    <Layout currentPage={currentPage.books}>
      <div>
        <div className="bg-primary px-3 py-2">
          <h1 className="mb-2 text-3xl font-bold">All Books Page</h1>
          <p>Here is where you can see all our books!</p>
        </div>

        <div className="m-2">
          <input
            type="search"
            id="form1"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Search books"
            aria-label="Search"
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fetchAllBookDataByKeywordDesc.data?.result.map((book, i) => {
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
      </div>
    </Layout>
  );
};

export default Dashboard;
