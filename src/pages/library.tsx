import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { requireAuth } from "../common/requireAuth";
import { trpc } from "../common/trpc";
import Layout from "../components.tsx/Layout";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})

  
  const booksarray = trpc.AllBookInLibrarySortedRecent.useQuery({ book_url: "", data}, {onSuccess: async (newData) => { 
  }})

 
  return ( //TODO: remove tailwind css and add your own
    <Layout>
      <div className="hero min-h-screen bg-base-200">
            <div className="hero-content">
              <div className="max-w-lg">
                <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
                  Library Page 
                </h1>
                <p className="my-4 text-center leading-loose">
                  Here is your library where you can see your book collection!
                </p>
                <h3>Recently Added</h3>
                <div className="row">
                {booksarray.data?.result.map((input) => {
                    return (
                          <div className="card mb-3" Style="width: 18rem; height: 25rem">
                            <div className="col-md-4">
                              <Image src="" className="img-fluid rounded-start" width={50} height={70} alt="..."></Image>
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">{input.book.name}</h5>
                                <p className="card-text">{input.book.synopsis?.substring(0, 150)}...</p>
                                <Link href={"/book/" + input.book.book_url} passHref legacyBehavior><a  className="btn btn-primary stretched-link">Read more</a></Link>
                              </div>
                            </div>
                          </div>
                    )
                })}
                </div>
                </div>
            </div>
          </div>
    </Layout>
  );
};

export default Dashboard;
