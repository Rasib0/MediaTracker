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

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchAllBookDataByKeywordDesc =
    trpc.fetchAllBookDataByKeywordDesc.useQuery(
      { keyword: searchKeyword },
    );

  return (
    //TODO: remove tailwind css and add your own
    <Layout currentPage={currentPage.books}>
      <div className="">
        <div className="bg-primary mb-2 p-3 text-white">
          <h1>All Books Page</h1>Here is where you can see all our books!
        </div>

        <div className="form-outline">
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Search books"
            aria-label="Search"
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
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
