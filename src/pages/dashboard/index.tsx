import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";

import { requireAuth } from "../../common/requireAuth";
import Layout from "../../components.tsx/Layout";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensistive information still the login occurs if we used 
const Dashboard: NextPage = () => {
  const { data } = useSession();

  return (
    <Layout>
    <div>
        <div>
          <h1 className="text-center">
            You are logged in!
          </h1>
          <p className="my-4 text-center">
            You are allowed to visit this page because you have a session,
            otherwise you would be redirected to the login page.
          </p>
          
          <div>
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>

          <div className="text-center">
            <button
              className="btn btn-secondary"
              onClick={() => console.log("button was pushed")}
            >
              Later
            </button>
          </div>
      </div>
    </div>
  </Layout>
  );
};

export default Dashboard;
