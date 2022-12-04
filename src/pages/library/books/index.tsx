import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
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
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true })


  const AllBookInLibrarySortedRecent = trpc.AllBookInLibrarySortedRecent.useQuery({ keyword: "", take: 5, data }, {
    onSuccess: async (newData) => {
    }
  })
  const AllBookInLibrarySortedRecentFav = trpc.AllBookInLibrarySortedRecentFav.useQuery({ keyword: "", take: 5 , data }, {
    onSuccess: async (newData) => {
    }
  })

  return (
    <Layout>
      <div className="">
        <div className="">
          <div className="">
          <div className="p-3 mb-2 bg-primary text-white cursor-pointer " onClick={() => {router.push("/library/books/")}}><h1>{data?.user.username}'s Library Page</h1>Here is your library where you can see your book collection!</div>
            <div className="p-3 mb-2 bg-secondary text-white cursor-pointer " onClick={() => {router.push("/library/books/recent")}}><h3>Recently Added</h3></div>

            <div className="row">
              {AllBookInLibrarySortedRecent.data?.result.map((input, i) => {
                  return <OverviewCard key={i} name={input.book.name}  type="books" rating={input.Rating} by={input.book.author} synopsis={input.book.synopsis} date={input.assignedAt} image_url={input.book.image_url} media_url={input.book.book_url}/>
              })}
            </div>
            <div className="p-3 mb-2 bg-secondary text-white cursor-pointer" onClick={() => {router.push("/library/books/favorites")}}><h3>Favorites</h3></div>
            <div className="row">
              {AllBookInLibrarySortedRecentFav.data?.result.map((input, i) => {
                  return <OverviewCard key={i} name={input.book.name} type={"books"} rating={input.Rating} by={input.book.author} synopsis={input.book.synopsis} date={input.assignedAt} image_url={input.book.image_url} media_url={input.book.book_url}/>
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
