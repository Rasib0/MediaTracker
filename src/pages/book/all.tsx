import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import router from "next/router";
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
  const [searchKeyword, setSearchKeyword] = useState("")

  const booksarray = trpc.fetchAllBookDataByKeywordDesc.useQuery({keyword: searchKeyword}, {onSuccess: async (newData) => { 
  }})

 
  return ( //TODO: remove tailwind css and add your own
    <Layout>
      <div className="">
            <div className="">
              <div className="">
                <div className="p-3 mb-2 bg-primary text-white"><h1>All Books Page</h1>Here is where you can see all our books!</div>

                <div className="form-outline">
                  <input type="search" id="form1" className="form-control" placeholder="Type query" aria-label="Search" onChange={(e) => {setSearchKeyword(e.target.value)}} />
                </div>


                <div className=""></div>
                <div className="grid">
                {booksarray.data?.result.map((input) => {
                  return (
                    <div>
                      <div className="link-primary cursor-pointer" onClick={() => router.push('/book/' + input.book_url)}>
                        <div className="mt-1 mb-1">
                          {input.name}
                        </div>

                      </div>
                    </div>
                  )})}
                </div>
                <div className="my-4 bg-gray-700 rounded-lg p-4">
                  <pre>
                    <code>{JSON.stringify(booksarray.data?.result, null, 2)}</code>
                  </pre>
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-secondary"
                    onClick={() => signOut({ callbackUrl: "/log-in" })}>
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
