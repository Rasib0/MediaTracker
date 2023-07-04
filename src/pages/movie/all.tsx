import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/layout";
import Card from "../../components.tsx/card";
import { currentPage } from "~/common/types";

// TODO: fix getServerSideProps later it shouldn't be required on every page
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchAllMovieDataByKeywordDesc =
    trpc.fetchAllMovieDataByKeywordDesc.useQuery({ keyword: searchKeyword });

  return (
    //TODO: remove tailwind css and add your own
    <Layout currentPage={currentPage.movies}>
      <div>
        <div className="bg-primary px-3 py-2">
          <h1 className="mb-2 text-3xl font-bold">All Movies Page</h1>
          <p>Here is where you can see all our movies!</p>
        </div>

        <div className="m-2">
          <input
            type="search"
            id="form1"
            className="w-full rounded-md border px-3 py-2"
            placeholder="Search movies"
            aria-label="Search"
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fetchAllMovieDataByKeywordDesc.data?.result.map((movie, i) => {
            return (
              <Card
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
    </Layout>
  );
};

export default Dashboard;
