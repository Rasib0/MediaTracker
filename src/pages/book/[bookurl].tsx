import type { NextPage } from "next";
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
  
  //getting params from router in book_url
  const { bookurl, ...tags } = useRouter().query
  const book_url = String(bookurl)

  //setting the state of the button according to user's 
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})

  
  const doesExist = trpc.checkInLibrary.useQuery({book_url}, {onSuccess: (newData) => {
    if(newData.exists) {
      setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
    } else {
      setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
    }
  }})

  //  const bookData = queryBook.data?.result

  const queryBook = trpc.findBookData.useQuery({book_url});


  //const c = trpc.searchBooksOfTags.useQuery({ keywords: 'abc', tags: ['fiction', 'fantasy']}) //need to fix the tag query
  
  const mutationAddtoLib = trpc.addToLibrary.useMutation()
  const mutationremoveFromLibrary = trpc.removeFromLibrary.useMutation()

  const handleLibraryOnClick = async () => {      
      if(ButtonState.shouldAdd){
        mutationAddtoLib.mutate({ book_url }, {onSuccess: (newData) => {
          setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
        },});
      } else {
        mutationremoveFromLibrary.mutate({ book_url }, {onSuccess: (newData) => {
          setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
        }});
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
          {<button className="btn" onClick={() => handleLibraryOnClick()} disabled={ButtonState.disabled}> {ButtonState.text}</button>}

          {(mutationAddtoLib.error || mutationremoveFromLibrary.error) && <p>Something went wrong! {mutationAddtoLib.error?.message} or {mutationremoveFromLibrary.error?.message}</p>}

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
