import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { requireAuth } from "../common/requireAuth";
import Layout from "../components.tsx/layout";
import { currentPage } from "~/common/types";

// The page that you only see if the authentication is successful, we could revamp this page to only should non-sensitive information still the login occurs if we used

const Dashboard: NextPage = () => {
  const { data } = useSession();

  return (
    <Layout currentPage={currentPage.none}>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-center text-3xl font-bold">
            You are logged in!
          </h1>
          <p className="text-center">
            You are allowed to visit this page because you have a session.
            Otherwise, you would be redirected to the login page.
          </p>
          <div className="mt-4">
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = requireAuth(async (_ctx) => {
  return { props: {} };
});

export default Dashboard;
