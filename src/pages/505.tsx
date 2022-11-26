import Link from "next/link";
import Layout from "../components.tsx/Layout";

export default function Custom500() {
    return (
      <Layout>
        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content">
          <div className="max-w-lg">
            <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
                500 - Server-side error occurred
            </h1>
            <div className="text-center">
              <Link href="/dashboard"><a className="text-center font-bold leading-snug text-gray-400">return to home</a></Link>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    )
  }