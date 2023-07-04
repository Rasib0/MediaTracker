import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { requireAuth } from "../../common/requireAuth";
import { trpc } from "../../common/trpc";
import { prisma } from "../../server/prisma";
import Layout from "../../components.tsx/layout";
import Image from "next/image";
import { RatingInput } from "~/components.tsx/rating";
import { Review, WriteAReviewWizard } from "../../components.tsx/review";
import { currentPage } from "~/common/types";
import { LoadingSpinner } from "~/components.tsx/loading";
import { set } from "zod";

export const getServerSideProps = requireAuth(async (ctx) => {
  // check if the the url parameter are a movie in the database
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
  author: string;
};

const Movie: NextPage<movieProps> = (props: movieProps) => {
  const session = useSession();
  const { movieurl, ...tags } = useRouter().query;
  const movie_url = String(movieurl);

  //setting the state of the button according to user's
  const [disabled, setDisabled] = useState(true);

  // TODO: use memo for text later
  const [buttonShouldAdd, setButtonShouldAdd] = useState(true);
  const [RatingState, setRatingState] = useState(NaN);
  const [ReviewState, setReviewState] = useState("Loading...");

  //Initial set up for stateful components
  const { data, refetch, isFetching, isLoading } =
    trpc.fetchSingleMovieDataByUrl.useQuery({
      movie_url,
    });

  const reviews_data_formatted = data?.result?.Users.map(
    (user: {
      Rating: number;
      Review: string;
      user: { username: string };
      assignedAt: string;
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
      onSuccess: (newData) => {
        // Having a cache that isn't being used you get a performance boost
        if (newData.exists) {
          setButtonShouldAdd(false);
          setRatingState(newData.result?.Rating ?? NaN);
          setReviewState(newData.result?.Review ?? "");
          setDisabled(false);
        } else {
          setButtonShouldAdd(true);
          setRatingState(NaN);
          setReviewState("Add to Library before writing a review.");
          setDisabled(false);
        }
      },
    }
  );

  const mutationAddToLib = trpc.addMovieToLibrary.useMutation();
  const mutationRemoveFromLib = trpc.removeMovieFromLibrary.useMutation();
  const mutationAddRating = trpc.addMovieRating.useMutation();
  const mutationAddReview = trpc.addMovieReview.useMutation();

  //disables rating
  const handleLibraryOnClick = () => {
    setDisabled(true);

    if (buttonShouldAdd) {
      mutationAddToLib.mutate(
        { movie_url },
        {
          onSuccess: (newData) => {
            setButtonShouldAdd(false);
            setDisabled(false);
            //TODO: add setDisabled to .then  after refetch
            //TODO: remove refeches
            refetch().catch((err) => {
              console.log(err);
            });
          },
        }
      );
    } else {
      mutationRemoveFromLib.mutate(
        { movie_url },
        {
          onSuccess: (newData) => {
            setDisabled(false);
            setButtonShouldAdd(true);
            setRatingState(NaN);
            setReviewState("");
            refetch().catch((err) => {
              console.log(err);
            });
          },
        }
      );
    }
  };

  const handleRatingOnClick = (rating: number) => {
    setDisabled(true);
    setRatingState(rating);
    mutationAddRating.mutate(
      { movie_url, rating },
      {
        onSuccess: (newData) => {
          setDisabled(false);
          setRatingState(newData.rating);

          refetch().catch((err) => {
            console.log(err);
          });
        },
      }
    );
  };

  const handleReviewOnSubmit = (review: string) => {
    setDisabled(true);
    setReviewState(review);
    mutationAddReview.mutate(
      { movie_url, review },
      {
        onSuccess: (newData) => {
          setDisabled(false);
          setReviewState(newData.review);
          refetch().catch((err) => {
            console.log(err);
          });
        },
      }
    );
  };

  return (
    <Layout currentPage={currentPage.movies}>
      <div className="flex flex-col items-center p-2">
        <h1 className="text-2xl font-bold">The Movie Page</h1>
        <p>
          Here is where you can find all the information about a single movie
          and rate them.
        </p>{" "}
      </div>

      <div>
        <hr></hr>
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            {props.name} by {props.author}
          </h2>
        </div>
        <div className="flex justify-center overflow-clip">
          <div className="flex flex-col justify-center gap-1 p-2">
            <Image
              src={`/images/movies/${props.image_url}.jpg`}
              className="w-32 rounded-lg  sm:h-72 sm:w-48"
              alt={`Movie cover ${props.name}`}
              width={208}
              height={288}
            />
            <button
              className="w-32 rounded-md bg-violet-400 py-2 font-semibold hover:bg-violet-600 disabled:bg-gray-500 dark:text-gray-900 sm:w-48 sm:px-4"
              onClick={handleLibraryOnClick}
              disabled={disabled}
            >
              {buttonShouldAdd ? (
                <span>Add to Library</span>
              ) : (
                <span>Remove</span>
              )}
            </button>
            {/* TODO: swap error with toasts */}
            {(mutationAddToLib.error || mutationRemoveFromLib.error) && (
              <p className="mt-2 text-red-500">
                Something went wrong! {mutationAddToLib.error?.message} or{" "}
                {mutationRemoveFromLib.error?.message}
              </p>
            )}
          </div>
          <div className="overflow-ellipsis-700 max-h-64 overflow-y-scroll p-4 text-sm sm:max-h-96">
            {props.synopsis}
          </div>
        </div>

        <div className="my-1 rounded-lg border p-3 shadow-xl">
          <div className="flex items-center">
            <h5 className="mt-1 text-2xl font-bold">Rate:&nbsp;</h5>
            <RatingInput
              rating={RatingState}
              disabled={disabled || buttonShouldAdd}
              onClick={handleRatingOnClick}
            />
          </div>
          <h3 className="mt-1 text-2xl font-semibold">Leave a Review:&nbsp;</h3>

          <WriteAReviewWizard
            review={ReviewState}
            onSubmit={handleReviewOnSubmit}
            disabled={disabled || buttonShouldAdd}
          />

          <h3 className="mb-2 text-2xl font-semibold">Reviews</h3>
          <div className="mb-6">
            {mutationAddReview.isLoading ||
            mutationAddRating.isLoading ||
            mutationAddToLib.isLoading ||
            mutationRemoveFromLib.isLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              reviews_data_formatted?.map((review, i) => (
                <Review
                  key={i}
                  by={review.name}
                  review={review.review}
                  date={new Date(review.date)}
                  rating={review.rating}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Movie;
