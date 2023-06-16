import Link from "next/link";
import Layout from "../components.tsx/layout";

export default function Custom500() {
  return (
    <div>
      <h1 className="text-center">500</h1>
      <h2 className="text-center">Server-side error occurred</h2>
      <div className="text-center">
        <Link href="/">
          return to home
        </Link>
      </div>
    </div>
  );
}
