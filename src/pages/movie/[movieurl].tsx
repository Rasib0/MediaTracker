import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import { prisma } from "../../server/prisma";
import Layout from "../../components.tsx/layout";
import RatingInput from "../../components.tsx/rating_input";
import Image from "next/image";
import Reviews from "../../components.tsx/reviews";
import ReviewInput from "../../components.tsx/review_input";

export const getServerSideProps = requireAuth(async (ctx) => {
  // check if the the url parameter are a book in the database
  const Movie = await prisma.movie.findFirst({
    where: {
      movie_url: String(ctx.params?.movieurl),
    },
    select: {
      id: true,
      synopsis: true,
      director: true,
      image_url: true,
      name: true,
    },
  });
  if (!Movie) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      synopsis: Movie.synopsis,
      name: Movie.name,
      author: Movie.director,
      image_url: Movie.image_url,
    },
  }; //TODO: Add reviews here
});

type movieProps = {
  synopsis: string;
  name: string;
  image_url: string;
  director: string;
};

const Movie: NextPage<movieProps> = (props: movieProps) => {
  const session = useSession();
  const { movieurl, ...tags } = useRouter().query;
  const movie_url = String(movieurl);

  //setting the state of the button according to user's
  const [ButtonState, setButtonState] = useState({
    text: "Loading...",
    disabled: true,
    shouldAdd: true,
  });
  const [RatingState, setRatingState] = useState({
    rating: NaN,
    disabled: true,
  });
  const [ReviewState, setReviewState] = useState({
    review: "Loading...",
    disabled: true,
  });

  //Initial set up for stateful components
  const { data, refetch } = trpc.fetchSingleMovieDataByUrl.useQuery({
    movie_url,
  });

  const reviews_data_formatted = data?.result?.Users.map(
    (user: {
      Rating: any;
      Review: any;
      user: { username: any };
      assignedAt: any;
    }) => {
      return {
        rating: user.Rating,
        review: user.Review,
        name: user.user.username,
        date: user.assignedAt,
      };
    }
  );

  const fetch_result = trpc.fetchMovieFromLibrary.useQuery(
    { movie_url, data: session.data },
    {
      onSuccess: async (newData) => {
        // Having a cache that isn't being used you get a performance boost
        if (newData.exists) {
          setButtonState({
            text: "Remove from Library",
            disabled: false,
            shouldAdd: false,
          });
          setRatingState({
            rating: Number(newData.result?.Rating),
            disabled: false,
          });
          setReviewState({
            review: String(newData.result?.Review),
            disabled: false,
          });
        } else {
          setButtonState({
            text: "Add to Library",
            disabled: false,
            shouldAdd: true,
          });
          setRatingState({ rating: NaN, disabled: true });
          setReviewState({ review: "Add to Library first.", disabled: true });
        }
      },
    }
  );

  const mutationAddtoLib = trpc.addMovieToLibrary.useMutation();
  const mutationremoveFromLib = trpc.removeMovieFromLibrary.useMutation();
  const mutationAddRating = trpc.addMovieRating.useMutation();
  const mutationAddReview = trpc.addMovieReview.useMutation();

  //disables rating
  const handleLibraryOnClick = async () => {
    setButtonState({
      text: ButtonState.text,
      disabled: true,
      shouldAdd: ButtonState.shouldAdd,
    });
    setRatingState({ rating: RatingState.rating, disabled: true });
    setReviewState({ review: ReviewState.review, disabled: true });

    if (ButtonState.shouldAdd) {
      mutationAddtoLib.mutate(
        { movie_url },
        {
          onSuccess: async (newData) => {
            setButtonState({
              text: "Remove from Library",
              disabled: false,
              shouldAdd: false,
            });
            setRatingState({ rating: RatingState.rating, disabled: false });
            setReviewState({ review: ReviewState.review, disabled: false });
            refetch();
          },
        }
      );
    } else {
      mutationremoveFromLib.mutate(
        { movie_url },
        {
          onSuccess: async (newData) => {
            setButtonState({
              text: "Add to Library",
              disabled: false,
              shouldAdd: true,
            });
            setRatingState({ rating: NaN, disabled: true });
            setReviewState({ review: ReviewState.review, disabled: true });
            refetch();
          },
        }
      );
    }
  };

  const handleRatingOnClick = async (rating: number) => {
    setRatingState({ rating, disabled: true });
    mutationAddRating.mutate(
      { movie_url, rating },
      {
        onSuccess: async (newData) => {
          setRatingState({ rating: newData.rating, disabled: false });
          refetch();
        },
      }
    );
  };

  const handleReviewOnSubmit = async (review: string) => {
    setReviewState({ review, disabled: true });
    mutationAddReview.mutate(
      { movie_url, review },
      {
        onSuccess: async (newData) => {
          setReviewState({ review: newData.review, disabled: false });
          refetch();
        },
      }
    );
  };

  return (
    <Layout>
      <div>
        <div className="bg-primary mb-2 p-3 text-white">
          <h1>Single Movies Page</h1>Here is where you can all the information
          about a single movie and rate them
        </div>

        <div className="card col m-1 mb-3 mt-2 rounded shadow ">
          <div className="row">
            <div className="col mb-1 mt-2">
              <Image
                src={"/images/movies/" + props.image_url + ".jpg"}
                className="img-fluid rounded"
                width={255}
                height={500}
                alt="..."
              ></Image>
            </div>
            <div className="col-md-11">
              <div className="card-body">
                <h5 className="card-title">{props.name}</h5>
                <div className="author">by {props.director}</div>
                <p className="card-text">{props.synopsis}</p>
              </div>
              <div className="mb-3">
                <RatingInput
                  rating={RatingState.rating}
                  disabled={RatingState.disabled}
                  onClick={handleRatingOnClick}
                />
              </div>
              {
                <button
                  className="btn btn-primary mb-3"
                  onClick={() => handleLibraryOnClick()}
                  disabled={ButtonState.disabled}
                >
                  {" "}
                  {ButtonState.text}
                </button>
              }

              <div className="error-message">
                {(mutationAddtoLib.error || mutationremoveFromLib.error) && (
                  <p>
                    Something went wrong! {mutationAddtoLib.error?.message} or{" "}
                    {mutationremoveFromLib.error?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3>Write a review</h3>
          <ReviewInput
            review={ReviewState.review}
            onSubmit={handleReviewOnSubmit}
            disabled={ReviewState.disabled}
          />

          <h3> Reviews </h3>
          {reviews_data_formatted?.map(
            (
              review: {
                name: string;
                review: string;
                date: Date | null;
                rating: number | null;
              },
              i
            ) => {
              return (
                <Reviews
                  key={i}
                  by={review.name}
                  review={review.review}
                  date={review.date}
                  rating={review.rating}
                />
              );
            }
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Movie;
