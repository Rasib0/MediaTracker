import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})

  
  const booksarray = trpc.AllBookInLibrarSortedRecent.useQuery({data}, {onSuccess: async (newData) => { 
  }})


  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="max-w-lg">
          <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
            You are logged in!
          </h1>
          <p className="my-4 text-center leading-loose">
            You are allowed to visit this page because you have a session,
            otherwise you would be redirected to the login page.
          </p>
          <div className="my-4 bg-gray-700 rounded-lg p-4">
            <pre>
              <code>{JSON.stringify(booksarray, null, 2)}</code>
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
  );
};

export default Dashboard;
