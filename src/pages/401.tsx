import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components.tsx/Layout";

// The page that you will see if didn't login 
// TODO fix the link formating using tailwind css


const Unauthorized: NextPage = () => {
  return (
      <div>
          <h1 className="text-center">
            401
          </h1>
          <h2 className="text-center">
            You are not logged in!
          </h2>
          <div className="text-center">
            <Link href="/"><a>return to home</a></Link>
          </div>
      </div>
  );
};

export default Unauthorized;
