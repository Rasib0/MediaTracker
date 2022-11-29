import type { NextPage } from "next";
import { useSession} from "next-auth/react";
import { useRouter } from 'next/router'
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import { prisma } from "../../common/prisma";
import Layout from "../../components.tsx/Layout";
import StarRating from "../../components.tsx/StarRating";

export const getServerSideProps = requireAuth(async (ctx) => {
  // check if the the url parameter are a book in the database
  const Book = await prisma.book.findFirst({
    where: {
        book_url: String(ctx.params?.bookurl)
    },
    select: {
      id: true,
      synopsis: true,
      author: true,
      image_url: true,
      name: true,
    }
  })
  if(!Book) {
    return {
      redirect: {
        destination: "/404", 
        permanent: false,
      },
    };
  }
  
  
return { props: {synopsis: Book.synopsis, title: Book.name, author: Book.author, image_url: Book.image_url} }; //TODO: Add reviews here
});

type bookProps = {
    synopsis: string;
    title: string;
    image_url: string;
    author: string;
};

const book: NextPage<bookProps> = (props: bookProps) => {
  const { data } = useSession();
  const { bookurl, ...tags } = useRouter().query
  const book_url = String(bookurl)

  //setting the state of the button according to user's 
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})
  const [RatingState, setRatingState] = useState({ rating: NaN, disabled: true})



  //Initial set up for stateful components

  const fetch_result = trpc.fetchFromLibrary.useQuery({book_url, data}, {onSuccess: async (newData) => {   // Having a cache that isn't being used you get a performance boost
    if(newData.exists) {
      setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
      setRatingState({rating: Number(newData.result?.Rating), disabled: false})
    } else {
      setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
      setRatingState({rating: NaN, disabled: true})
    }
  }})

  const mutationAddtoLib = trpc.addToLibrary.useMutation()
  const mutationremoveFromLib = trpc.removeFromLibrary.useMutation()
  const mutationAddRating = trpc.addRating.useMutation()


  //disables rating 
  const handleLibraryOnClick = async () => {      
      setButtonState({text: ButtonState.text, disabled: true, shouldAdd: ButtonState.shouldAdd})
      setRatingState({rating: RatingState.rating, disabled: true})

      if(ButtonState.shouldAdd){
        mutationAddtoLib.mutate({ book_url }, {onSuccess: async (newData) => {
          setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
          setRatingState({rating: RatingState.rating, disabled: false})
        },});
      } else {
        mutationremoveFromLib.mutate({ book_url }, {onSuccess: async (newData) => {
          setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
          setRatingState({rating: NaN, disabled: true})
        }});
      }
  };

  const handleRatingOnClick = async (rating: number) => {
          setRatingState({rating, disabled: true})
          mutationAddRating.mutate({book_url, rating}, { onSuccess: async (newData) => {
          setRatingState({rating: newData.rating, disabled: false})
        }
      })
  }

  return (
    <Layout>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content">
          <div className="max-w-lg">
            <h1 className="text-5xl text-center font-bold leading-snug text-gray-400">
              This is the single book page.
            </h1>
            <StarRating rating={RatingState.rating} disabled={RatingState.disabled} onClick={handleRatingOnClick}/>
            <p className="text-center leading-loose">
              You are allowed to visit this page because you have a session,
              otherwise you would be redirected to the login page.
            </p>
            {<button className="btn btn-primary" onClick={() => handleLibraryOnClick()} disabled={ButtonState.disabled}> {ButtonState.text}</button>}

              
            <div className="error-message">{(mutationAddtoLib.error || mutationremoveFromLib.error) && <p>Something went wrong! {mutationAddtoLib.error?.message} or {mutationremoveFromLib.error?.message}</p>}</div>
            
            
            <div className="title">Title: {props.title}</div>
            <div className="author">Author: {props.title} </div>
            <div className="Image">Image url: {props.image_url} </div>
            <div className="synopsis">Synopsis: {props.synopsis}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default book;
