import type { NextPage } from "next";
import { fetchData } from "next-auth/client/_utils";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/router'
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";

export const getServerSideProps = requireAuth(async (ctx) => {
  return { props: {} };
});

const book: NextPage = () => {
  const { data } = useSession();
  const router = useRouter()
  const [inLib, setInLib] = useState(true)
  const { bookurl, ...tags } = router.query
  const book_url = String(bookurl)


  //const q = trpc.searchBooks.useQuery({ keywords: book_url});
  //const c = trpc.searchBooksOfTags.useQuery({ keywords: 'abc', tags: ['fiction', 'fantasy']}) //need to fix the tag query
  //console.log(q.data?.result)   //console.log(c.data)


  //const queryCheckInLib = trpc.checkInLibrary.useQuery({book_url})
  //console.log(queryCheckInLib.data)

  const mutationAddtoLib = trpc.addToLibrary.useMutation()
  //const mutationremoveFromLibrary = trpc.removeFromLibrary.useMutation()

  const handleLibraryOnClick = async () => {
    if(inLib){
      mutationAddtoLib.mutate({ book_url });
    } else {
      //mutationremoveFromLibrary.mutate({ book_url });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="max-w-lg">
          <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
            This is the single book page.
          </h1>
          <p className="my-4 text-center leading-loose">
            You are allowed to visit this page because you have a session,
            otherwise you would be redirected to the login page.
          </p>
          <button className="btn" onClick={handleLibraryOnClick}> { inLib ? "Add to library" : "Remove from library"}</button>

          {mutationAddtoLib.error && <p>Something went wrong! {mutationAddtoLib.error.message}</p>}
          
          <div className="my-4 bg-gray-700 rounded-lg p-4">
            <pre>
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
          <div className="text-center">
            <button
              className="btn btn-secondary"
              onClick={() => signOut({ callbackUrl: "/" })}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default book;
