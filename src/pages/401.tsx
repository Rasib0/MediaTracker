import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components.tsx/Layout";

// The page that you will see if didn't login 
// TODO fix the link formating using tailwind css
const Unauthorized: NextPage = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="max-w-lg">
          <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
            You are not logged in!
          </h1>
          <div className="text-center">
          <Link href="/log-in"><a className="text-center font-bold leading-snug text-gray-400">Log in!</a></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
