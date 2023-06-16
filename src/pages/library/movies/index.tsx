import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../../../common/requireAuth";
import { trpc } from "../../../common/trpc";
import OverviewCard from "../../../components.tsx/card";
import Layout from "../../../components.tsx/layout";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();

  const AllMovieInLibrarySortedRecent =
    trpc.AllMovieInLibrarySortedRecent.useQuery(
      { keyword: "", take: 5, data },
      {
        onSuccess: async (newData) => {},
      }
    );
  const AllMovieInLibrarySortedRecentFav =
    trpc.AllMovieInLibrarySortedRecentFav.useQuery(
      { keyword: "", take: 5, data },
      {
        onSuccess: async (newData) => {},
      }
    );

  return (
    <Layout>
      <div className="">
        <div className="">
          <div className="">
            <div
              className="bg-primary mb-2 cursor-pointer p-3 text-white "
              onClick={() => {
                router.push("/library/movies/");
              }}
            >
              <h1>{data?.user.username}&apos;s Movie Library Page</h1>Here is
              your Movie library where you can see your Movie collection!
            </div>
            <div
              className="bg-secondary mb-2 cursor-pointer p-3 text-white "
              onClick={() => {
                router.push("/library/movies/recent");
              }}
            >
              <h3>Recently Added</h3>
            </div>

            <div className="cards">
              {AllMovieInLibrarySortedRecent.data?.result.map((input, i) => {
                return (
                  <OverviewCard
                    key={i}
                    name={input.movie.name}
                    type="movies"
                    rating={input.Rating}
                    by={input.movie.director}
                    synopsis={input.movie.synopsis}
                    date={input.assignedAt}
                    image_url={input.movie.image_url}
                    media_url={input.movie.movie_url}
                  />
                );
              })}
            </div>
            <div
              className="bg-secondary mb-2 cursor-pointer p-3 text-white"
              onClick={() => {
                router.push("/library/movies/favorites");
              }}
            >
              <h3>Favorites</h3>
            </div>
            <div className="cards">
              {AllMovieInLibrarySortedRecentFav.data?.result.map((input, i) => {
                return (
                  <OverviewCard
                    key={i}
                    name={input.movie.name}
                    type={"movies"}
                    rating={input.Rating}
                    by={input.movie.director}
                    synopsis={input.movie.synopsis}
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
