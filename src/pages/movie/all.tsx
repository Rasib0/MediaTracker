import type { NextPage } from "next";
import { useSession} from "next-auth/react";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/Layout";
import OverviewCard from "../../components.tsx/OverviewCard";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});


// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [searchKeyword, setSearchKeyword] = useState("")

  const fetchAllMovieDataByKeywordDesc = trpc.fetchAllMovieDataByKeywordDesc.useQuery({keyword: searchKeyword}, {onSuccess: async (newData) => { 
  }})  

 
  return ( //TODO: remove tailwind css and add your own
    <Layout>
              <div className="">
                <div className="p-3 mb-2 bg-primary text-white"><h1>All Movies Page</h1>Here is where you can see all our movies!</div>

                <div className="form-outline">
                  <input type="search" id="form1" className="form-control" placeholder="Search books" aria-label="Search" onChange={(e) => {setSearchKeyword(e.target.value)}} />
                </div>

                <div className="row">
                {fetchAllMovieDataByKeywordDesc.data?.result.map((movie) => {
                  return <OverviewCard name={movie.name} type="movies" rating={null} by={movie.director} synopsis={movie.synopsis} date={null} image_url={movie.image_url} media_url={movie.movie_url}/>
                   })}
                </div>
          </div>
    </Layout>
  );
};

export default Dashboard;
