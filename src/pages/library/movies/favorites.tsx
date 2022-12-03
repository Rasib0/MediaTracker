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
  const [searchKeyword, setSearchKeyword] = useState("")

  const AllMovieInLibrarySortedRecentFav = trpc.AllMovieInLibrarySortedRecentFav.useQuery({ keyword: searchKeyword, take : 15, data }, {
    onSuccess: async (newData) => {
    }
  })

  return ( //TODO: remove tailwind css and add your own
    <Layout>
      <div className="">
        <div className="">
          <div className="">
          <div className="p-3 mb-2 bg-primary text-white" onClick={() => {router.push("/library/")}}><h1>{data?.user.username}'s Library Page</h1>Here is your library where you can see your movie collection!</div>
            <div className="p-3 mb-2 bg-secondary text-white" onClick={() => {router.push("/library/favorites")}}><h3>Favorites</h3></div>
            <div className="form-outline">
                  <input type="search" id="form1" className="form-control" placeholder="Search your favorites" aria-label="Search" onChange={(e) => {setSearchKeyword(e.target.value)}} />
            </div>
            <div className="row">
                  {AllMovieInLibrarySortedRecentFav.data?.result.map((input, i) => {
                    return <OverviewCard name={input.movie.name} type="movies" rating={input.Rating} by={input.movie.director} synopsis={input.movie.synopsis} date={input.assignedAt} image_url={input.movie.image_url} media_url={input.movie.movie_url}/>
                  })}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
