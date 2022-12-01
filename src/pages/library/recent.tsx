import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
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
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true })


  const AllBookInLibrarySortedRecent = trpc.AllBookInLibrarySortedRecent.useQuery({ book_url: "", take : 15, data }, {
    onSuccess: async (newData) => {
    }
  })


  return ( //TODO: remove tailwind css and add your own
    <Layout>
          <div className="">
          <div className="p-3 mb-2 bg-primary text-white" onClick={() => {router.push("/library/")}}><h1>{data?.user.username}'s Library Page</h1>Here is your library where you can see your book collection!</div>
            <div className="p-3 mb-2 bg-secondary text-white" onClick={() => {router.push("/library/recent")}}><h3>Recently Added</h3></div>

            <div className="row">
              {AllBookInLibrarySortedRecent.data?.result.map((input, i) => {
                return (
                    <div key={i} className="card mb-3 mt-2 max_width col m-1 shadow rounded ">
                      <div className="row g-0">
                        <div className="col mt-2 mb-1">
                          <Image src={"/images/" + input.book.image_url + ".jpg"} className="img-fluid rounded" width={255} height={500} alt="..."></Image>
                          <Link href={"/book/" + input.book.book_url} passHref legacyBehavior><a className="btn btn-primary stretched-link ml-1">Read more</a></Link>
                        </div>

                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{input.book.name}</h5>
                            <p className="card-text">{input.book.synopsis?.substring(0, 150)}... read more</p>
                          </div>
                        </div>
                      </div>
                  </div>
                )
              })}
            </div>
        <style jsx>
          {`
              .max_width {
                max-width: 350px;
                min-width: 350px;
                max-height: 500px;
                overflow: hidden;
              }
              .wrapper {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                grid-auto-rows: minmax(100px, auto);
              }
              .one {
                grid-column: 1 / 3;
                grid-row: 1;
              }
              .two {
                grid-column: 2 / 4;
                grid-row: 1 / 3;
              }
              .three {
                grid-column: 1;
                grid-row: 2 / 5;
              }
              .four {
                grid-column: 3;
                grid-row: 3;
              }
              .five {
                grid-column: 2;
                grid-row: 4;
              }
              .six {
                grid-column: 3;
                grid-row: 4;
              }
              `}
        </style>
      </div>
    </Layout>
  );
};

export default Dashboard;
