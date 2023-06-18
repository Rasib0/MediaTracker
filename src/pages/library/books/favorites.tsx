import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../../../common/requireAuth";
import { trpc } from "../../../common/trpc";
import OverviewCard from "../../../components.tsx/card";
import Layout from "../../../components.tsx/layout";
import TextInput from "../../../components.tsx/text_input";
import { currentPage } from "~/common/types";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (_ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  const AllBookInLibrarySortedRecentFav =
    trpc.AllBookInLibrarySortedRecentFav.useQuery({
      keyword: searchKeyword,
      take: 15,
      data,
    });

  const FavoritesArray = AllBookInLibrarySortedRecentFav.data?.result;

  return (
    //TODO: remove tailwind css and add your own
    <Layout currentPage={currentPage.library}>
      <div className="">
        <div className="">
          <div className="">
            <div
              className="bg-primary mb-2 p-3 text-white"
              onClick={() => {
                router.push("/library/books/");
              }}
            >
              <h1>{data?.user.username}&apos;s Library Page</h1>Here is your
              library where you can see your book collection!
            </div>
            <div
              className="bg-secondary mb-2 p-3 text-white"
              onClick={() => {
                router.push("/library/books/favorites");
              }}
            >
              <h3>Favorites</h3>
            </div>
            <div className="form-outline">
              <input
                type="search"
                id="form1"
                className="form-control"
                placeholder="Search your favorites"
                aria-label="Search"
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                }}
              />
            </div>
            {!(FavoritesArray?.length === 0) ? (
              <div className="cards">
                {FavoritesArray?.map((input, i) => {
                  return (
                    <OverviewCard
                      key={i}
                      name={input.book.name}
                      type="books"
                      show_author={false}
                      rating={input.Rating}
                      by={input.book.author}
                      synopsis={input.book.synopsis}
                      date={input.assignedAt}
                      image_url={input.book.image_url}
                      media_url={input.book.book_url}
                    />
                  );
                })}
              </div>
            ) : (
              <TextInput message="No Books found!" />
            )}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .cards {
            display: grid;
            grid-template-columns: repeat(
              auto-fill,
              minmax(min(399px, 100%), 1fr)
            );
          }
        `}
      </style>
    </Layout>
  );
};

export default Dashboard;
