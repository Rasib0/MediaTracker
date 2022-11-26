import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import Layout from "../../components.tsx/Layout";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})

  
  const booksarray = trpc.AllBookInLibrarySortedRecent.useQuery({data}, {onSuccess: async (newData) => { 
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
                {booksarray.data?.result.map((input) => {
                    return (
                      <div>
                        <a href={'/book/' + input.book.book_url}>
                          <div>
                            Name: {input.book.name}
                          </div>
                          <div>
                            Synopsis: 
                          </div>
                          <div>
                          </div>
                        </a>
                      </div>
            
                    )
                })}
                <div className="my-4 bg-gray-700 rounded-lg p-4">
                  <pre>
                    <code>{JSON.stringify(booksarray.data?.result, null, 2)}</code>
                  </pre>
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-secondary"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
    </Layout>
  );
};

export default Dashboard;
