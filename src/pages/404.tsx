import Link from "next/link";
import Layout from "../components.tsx/Layout";

// pages/404.js
export default function Custom404() {
  return (
    <div>
      <h1 className="text-center">404</h1>
      <h2 className="text-center">Page Not Found</h2>
      <div className="text-center">
        <Link href="/">
          <a>return to home</a>
        </Link>
      </div>
    </div>
  );
}
