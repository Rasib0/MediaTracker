import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../../../common/requireAuth";
import { trpc } from "../../../common/trpc";
import OverviewCard from "../../../components.tsx/OverviewCard";
import Layout from "../../../components.tsx/Layout";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();


  const AllMovieInLibrarySortedRecent = trpc.AllMovieInLibrarySortedRecent.useQuery({ keyword: "", take: 5, data }, {
    onSuccess: async (newData) => {
    }
  })
  const AllMovieInLibrarySortedRecentFav = trpc.AllMovieInLibrarySortedRecentFav.useQuery({ keyword: "", take: 5 , data }, {
    onSuccess: async (newData) => {
    }
  })

  return (
    <Layout>
      <div className="">
        <div className="">
          <div className="">
          <div className="p-3 mb-2 bg-primary text-white cursor-pointer " onClick={() => {router.push("/library/movies/")}}><h1>{data?.user.username}&apos;s Movie Library Page</h1>Here is your Movie library where you can see your Movie collection!</div>
            <div className="p-3 mb-2 bg-secondary text-white cursor-pointer " onClick={() => {router.push("/library/movies/recent")}}><h3>Recently Added</h3></div>

            <div className="row">
              {AllMovieInLibrarySortedRecent.data?.result.map((input, i) => {
                  return <OverviewCard key={i} name={input.movie.name}  type="movies" rating={input.Rating} by={input.movie.director} synopsis={input.movie.synopsis} date={input.assignedAt} image_url={input.movie.image_url} media_url={input.movie.movie_url}/>
              })}
            </div>
            <div className="p-3 mb-2 bg-secondary text-white cursor-pointer" onClick={() => {router.push("/library/movies/favorites")}}><h3>Favorites</h3></div>
            <div className="row">
              {AllMovieInLibrarySortedRecentFav.data?.result.map((input, i) => {
                  return <OverviewCard key={i} name={input.movie.name} type={"movies"} rating={input.Rating} by={input.movie.director} synopsis={input.movie.synopsis} date={input.assignedAt} image_url={input.movie.image_url} media_url={input.movie.movie_url}/>
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
