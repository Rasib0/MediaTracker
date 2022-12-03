import type { NextPage } from "next";
import { useSession} from "next-auth/react";
import { useRouter } from 'next/router'
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import { prisma } from "../../common/prisma";
import Layout from "../../components.tsx/Layout";
import StarRating from "../../components.tsx/StarRating";
import Image from "next/image";

export const getServerSideProps = requireAuth(async (ctx) => {
  // check if the the url parameter are a book in the database
  const Movie = await prisma.movie.findFirst({
    where: {
        movie_url: String(ctx.params?.movieurl)
    },
    select: {
      id: true,
      synopsis: true,
      director: true,
      image_url: true,
      name: true,
    }
  })
  if(!Movie) {
    return {
      redirect: {
        destination: "/404", 
        permanent: false,
      },
    };
  }
  
  
return { props: {synopsis: Movie.synopsis, name: Movie.name, author: Movie.director, image_url: Movie.image_url} }; //TODO: Add reviews here
});

type movieProps = {
    synopsis: string;
    name: string;
    image_url: string;
    director: string;
};

const movie: NextPage<movieProps> = (props: movieProps) => {
  const { data } = useSession();
  const { movieurl, ...tags } = useRouter().query
  const movie_url = String(movieurl)

  //setting the state of the button according to user's 
  const [ButtonState, setButtonState] = useState({ text: "Loading...", disabled: true, shouldAdd: true})
  const [RatingState, setRatingState] = useState({ rating: NaN, disabled: true})


  //Initial set up for stateful components

  const fetch_result = trpc.fetchMovieFromLibrary.useQuery({movie_url, data}, {onSuccess: async (newData) => {   // Having a cache that isn't being used you get a performance boost
    if(newData.exists) {
      setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
      setRatingState({rating: Number(newData.result?.Rating), disabled: false})
    } else {
      setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
      setRatingState({rating: NaN, disabled: true})
    }
  }})

  const mutationAddtoLib = trpc.addMovieToLibrary.useMutation()
  const mutationremoveFromLib = trpc.removeMovieFromLibrary.useMutation()
  const mutationAddRating = trpc.addMovieRating.useMutation()


  //disables rating 
  const handleLibraryOnClick = async () => {      
      setButtonState({text: ButtonState.text, disabled: true, shouldAdd: ButtonState.shouldAdd})
      setRatingState({rating: RatingState.rating, disabled: true})

      if(ButtonState.shouldAdd){
        mutationAddtoLib.mutate({ movie_url }, {onSuccess: async (newData) => {
          setButtonState({text: "Remove from Library", disabled: false, shouldAdd: false})
          setRatingState({rating: RatingState.rating, disabled: false})
        },});
      } else {
        mutationremoveFromLib.mutate({ movie_url }, {onSuccess: async (newData) => {
          setButtonState({text: "Add to Library", disabled: false, shouldAdd: true})
          setRatingState({rating: NaN, disabled: true})
        }});
      }
  };

  const handleRatingOnClick = async (rating: number) => {
          setRatingState({rating, disabled: true})
          mutationAddRating.mutate({movie_url, rating}, { onSuccess: async (newData) => {
          setRatingState({rating: newData.rating, disabled: false})
        }
      })
  }

  return (
    <Layout>
          <div>
            <div className="p-3 mb-2 bg-primary text-white"><h1>Single Books Page</h1>Here is where you can all the information about a single book and rate them</div>

            <div className="card mb-3 mt-2 col m-1 shadow rounded ">
                      <div className="row">
                        <div className="col mt-2 mb-1">
                          <Image src={"/images/movies/" + props.image_url + ".jpg"} className="img-fluid rounded" width={255} height={500} alt="..."></Image>
                        </div>
                        <div className="col-md-11">
                          <div className="card-body">
                            <h5 className="card-title">{props.name}</h5>
                            <div className="author">by {props.director}</div>
                            <p className="card-text">{props.synopsis}</p>
                          </div>
                          <div className="mb-3"><StarRating  rating={RatingState.rating} disabled={RatingState.disabled} onClick={handleRatingOnClick}/></div>
                          {<button className="btn btn-primary mb-3" onClick={() => handleLibraryOnClick()} disabled={ButtonState.disabled}> {ButtonState.text}</button>}

                          <div className="error-message">{(mutationAddtoLib.error || mutationremoveFromLib.error) && <p>Something went wrong! {mutationAddtoLib.error?.message} or {mutationremoveFromLib.error?.message}</p>}</div>
                        </div>
                      </div>
                  </div>
          </div>
    </Layout>
  );
};

export default movie;
