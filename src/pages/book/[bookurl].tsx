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

export const getServerSideProps = requireAuth(async (ctx) => {
  // check if the the url parameter are a book in the database
  const Book = await prisma.book.findFirst({
    where: {
      book_url: String(ctx.params?.bookurl),
    },
    select: {
      id: true,
      synopsis: true,
      author: true,
      image_url: true,
      name: true,
    },
  });
  if (!Book) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      synopsis: Book.synopsis,
      name: Book.name,
      author: Book.author,
      image_url: Book.image_url,
    },
  }; //TODO: Add reviews here
});

type bookProps = {
  synopsis: string;
  name: string;
  image_url: string;
  author: string;
};

const Book: NextPage<bookProps> = (props: bookProps) => {
  const session = useSession();
  const { bookurl, ...tags } = useRouter().query;
  const book_url = String(bookurl);

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
  const { data, refetch } = trpc.fetchSingleBookDataByUrl.useQuery({
    book_url,
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

  const fetch_result = trpc.fetchBookFromLibrary.useQuery(
    { book_url, data: session.data },
    {
      onSuccess: (newData) => {
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

  const mutationAddToLib = trpc.addToBookLibrary.useMutation();
  const mutationRemoveFromLib = trpc.removeBookFromLibrary.useMutation();
  const mutationAddRating = trpc.addBookRating.useMutation();
  const mutationAddReview = trpc.addBookReview.useMutation();

  //disables rating
  const handleLibraryOnClick = () => {
    setButtonState({
      text: ButtonState.text,
      disabled: true,
      shouldAdd: ButtonState.shouldAdd,
    });
    setRatingState({ rating: RatingState.rating, disabled: true });
    setReviewState({ review: ReviewState.review, disabled: true });

    if (ButtonState.shouldAdd) {
      mutationAddToLib.mutate(
        { book_url },
        {
          onSuccess: (newData) => {
            setButtonState({
              text: "Remove from Library",
              disabled: false,
              shouldAdd: false,
            });
            setRatingState({ rating: RatingState.rating, disabled: false });
            setReviewState({ review: ReviewState.review, disabled: false });
            //TODO: remove refeches
            refetch().catch((err) => {
              console.log(err);
            });
          },
        }
      );
    } else {
      mutationRemoveFromLib.mutate(
        { book_url },
        {
          onSuccess: (newData) => {
            setButtonState({
              text: "Add to Library",
              disabled: false,
              shouldAdd: true,
            });
            setRatingState({ rating: NaN, disabled: true });
            setReviewState({ review: ReviewState.review, disabled: true });
            refetch().catch((err) => {
              console.log(err);
            });
          },
        }
      );
    }
  };

  const handleRatingOnClick = (rating: number) => {
    setRatingState({ rating, disabled: true });
    mutationAddRating.mutate(
      { book_url, rating },
      {
        onSuccess: (newData) => {
          setRatingState({ rating: newData.rating, disabled: false });
          refetch().catch((err) => {
            console.log(err);
          });
        },
      }
    );
  };

  const handleReviewOnSubmit = (review: string) => {
    setReviewState({ review, disabled: true });
    mutationAddReview.mutate(
      { book_url, review },
      {
        onSuccess: (newData) => {
          setReviewState({ review: newData.review, disabled: false });
          refetch().catch((err) => {
            console.log(err);
          });
        },
      }
    );
  };

  return (
    <Layout currentPage={currentPage.books}>
      <div className="mb-2 bg-blue-500 p-3">
        <h1 className="text-3xl font-bold">Single Books Page</h1>
        <p>
          Here is where you can find all the information about a single book and
          rate them.
        </p>
      </div>
      <div className="mx-auto max-w-4xl rounded-lg bg-gray-100 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-center">
          <h5 className="text-2xl font-bold">
            {props.name} by {props.author}
          </h5>
        </div>
        <div className="flex border py-2">
          <div className="w-1/3">
            <div className="flex justify-center">
              <div>
                <div className="relative h-72 w-48 overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src={`/images/books/${props.image_url}.jpg`}
                    className="rounded-lg"
                    alt="Book cover"
                    fill={true}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    className="mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none"
                    onClick={handleLibraryOnClick}
                    disabled={ButtonState.disabled}
                  >
                    {ButtonState.text}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2">
              {(mutationAddToLib.error || mutationRemoveFromLib.error) && (
                <p className="text-red-500">
                  Something went wrong! {mutationAddToLib.error?.message} or{" "}
                  {mutationRemoveFromLib.error?.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-2/3 pl-5">
            <div className="overflow-y-auto">
              <p className="text-sm text-gray-700">{props.synopsis}</p>
            </div>
          </div>
        </div>

        <div className="my-1 rounded-lg border p-3 shadow-xl">
          <div className="flex items-center">
            <h5 className="mt-1 text-2xl font-bold">Write a review</h5>
            <div className="w-4"></div>
            <RatingInput
              rating={RatingState.rating}
              disabled={RatingState.disabled}
              onClick={handleRatingOnClick}
            />
          </div>
          <WriteAReviewWizard
            review={ReviewState.review}
            onSubmit={handleReviewOnSubmit}
            disabled={ReviewState.disabled}
          />

          <h3 className="mb-2 text-2xl font-bold">Reviews</h3>
          {reviews_data_formatted?.map((review, i) => (
            <Review
              key={i}
              by={review.name}
              review={review.review}
              date={review.date}
              rating={review.rating}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default Book;
