import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/layout";
import OverviewCard from "../../components.tsx/card";
import { currentPage } from "~/common/types";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchAllMovieDataByKeywordDesc =
    trpc.fetchAllMovieDataByKeywordDesc.useQuery(
      { keyword: searchKeyword },
      { onSuccess: async (newData) => {} }
    );

  return (
    //TODO: remove tailwind css and add your own
    <Layout currentPage={currentPage.movies}>
      <div className="">
        <div className="bg-primary mb-2 p-3 text-white">
          <h1>All Movies Page</h1>Here is where you can see all our movies!
        </div>

        <div className="form-outline">
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Search movies"
            aria-label="Search"
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>

        <div className="cards">
          {fetchAllMovieDataByKeywordDesc.data?.result.map((movie, i) => {
            return (
              <OverviewCard
                key={i}
                name={movie.name}
                type="movies"
                rating={null}
                by={movie.director}
                synopsis={movie.synopsis}
                show_author={false}
                date={null}
                image_url={movie.image_url}
                media_url={movie.movie_url}
              />
            );
          })}
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
