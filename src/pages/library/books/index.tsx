import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../../../common/requireAuth";
import { trpc } from "../../../common/trpc";
import OverviewCard from "../../../components.tsx/card";
import Layout from "../../../components.tsx/layout";
import { currentPage } from "~/common/types";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [ButtonState, setButtonState] = useState({
    text: "Loading...",
    disabled: true,
    shouldAdd: true,
  });

  const AllBookInLibrarySortedRecent =
    trpc.AllBookInLibrarySortedRecent.useQuery(
      { keyword: "", take: 5, data },
      {
        onSuccess: async (newData) => {},
      }
    );
  const AllBookInLibrarySortedRecentFav =
    trpc.AllBookInLibrarySortedRecentFav.useQuery(
      { keyword: "", take: 5, data },
      {
        onSuccess: async (newData) => {},
      }
    );

  return (
    <Layout currentPage={currentPage.library}>
      <div className="">
        <div className="">
          <div className="">
            <div
              className="bg-primary mb-2 cursor-pointer p-3 text-white "
              onClick={() => {
                router.push("/library/books/");
              }}
            >
              <h1>{data?.user.username}&apos;s Library Page</h1>Here is your
              library where you can see your book collection!
            </div>
            <div
              className="bg-secondary mb-2 cursor-pointer p-3 text-white "
              onClick={() => {
                router.push("/library/books/recent");
              }}
            >
              <h3>Recently Added</h3>
            </div>

            <div className="cards">
              {AllBookInLibrarySortedRecent.data?.result.map((input, i) => {
                return (
                  <OverviewCard
                    key={i}
                    name={input.book.name}
                    type="books"
                    rating={input.Rating}
                    by={input.book.author}
                    show_author={false}
                    synopsis={input.book.synopsis}
                    date={input.assignedAt}
                    image_url={input.book.image_url}
                    media_url={input.book.book_url}
                  />
                );
              })}
            </div>
            <div
              className="bg-secondary mb-2 cursor-pointer p-3 text-white"
              onClick={() => {
                router.push("/library/books/favorites");
              }}
            >
              <h3>Favorites</h3>
            </div>
            <div className="cards">
              {AllBookInLibrarySortedRecentFav.data?.result.map((input, i) => {
                return (
                  <OverviewCard
                    key={i}
                    name={input.book.name}
                    type={"books"}
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
