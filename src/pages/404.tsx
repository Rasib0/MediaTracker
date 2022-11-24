import Link from "next/link";

  // pages/404.js
export default function Custom404() {
  return (
  <div className="hero min-h-screen bg-base-200">
  <div className="hero-content">
    <div className="max-w-lg">
      <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
        404 - Page Not Found
      </h1>
      <div className="text-center">
        <Link href="/"><a className="font-bold text-gray-400">return to home</a></Link>
      </div>
    </div>
  </div>
</div>
  )
}