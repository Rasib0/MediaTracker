import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../../../common/requireAuth";
import { trpc } from "../../../common/trpc";
import OverviewCard from "../../../components.tsx/card";
import Layout from "../../../components.tsx/layout";
import { currentPage } from "~/common/types";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  // useQuery already uses useEffect hook
  const AllMovieInLibrarySortedRecentFav =
    trpc.AllMovieInLibrarySortedRecentFav.useQuery(
      { keyword: searchKeyword, take: 15, data },
    );

  return (
    //TODO: remove tailwind css and add your own
    <Layout currentPage={currentPage.library}>
      <div className="">
        <div className="">
          <div className="">
            <div
              className="bg-primary mb-2 p-3"
              onClick={() => {
                void router.push("/library/movies/");
              }}
            >
              <h1>{data?.user.username}&apos;s Library Page</h1>Here is your
              library where you can see your movie collection!
            </div>
            <div
              className="bg-secondary mb-2 p-3"
              onClick={() => {
                void router.push("/library/movies/favorites");
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
            <div className="cards">
              {AllMovieInLibrarySortedRecentFav.data?.result.map((input, i) => {
                return (
                  <OverviewCard
                    key={i}
                    name={input.movie.name}
                    type="movies"
                    rating={input.Rating}
                    by={input.movie.director}
                    synopsis={input.movie.synopsis}
                    show_author={false}
                    date={input.assignedAt}
                    image_url={input.movie.image_url}
                    media_url={input.movie.movie_url}
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
