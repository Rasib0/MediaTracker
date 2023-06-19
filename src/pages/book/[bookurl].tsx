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
import Reviews from "../../components.tsx/review";
import ReviewInput from "../../components.tsx/review_input";
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
            refetch()
              .catch((err) => {
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
            refetch()
              .catch((err) => {
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
          refetch()
          .catch((err) => {
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
          refetch()
            .catch((err) => {
              console.log(err);
            });
        },
      }
    );
  };

  return (
    <Layout currentPage={currentPage.books}>
      <div className="bg-primary mb-2 p-3 text-white">
        <h1>Single Books Page</h1>Here is where you can all the information
        about a single book and rate them
      </div>
        <div className="page-size center-flex">
          <div className="card font_set mb-5 mt-1 rounded p-3 shadow">
              <h5>
                {props.name} by {props.author}
              </h5>
              <RatingInput
                rating={RatingState.rating}
                disabled={RatingState.disabled}
                onClick={handleRatingOnClick}
              />

            <div className="card_body mt-3">
              <div>
                <div className="center-flex mb-3">
                  <div className="image_size">
                    <Image
                      src={"/images/books/" + props.image_url + ".jpg"}
                      className="img-fluid rounded"
                      width={255}
                      height={500}
                      alt="..."
                    ></Image>
                  </div>
                  {
                    <button
                      className="button-size m-3"
                      onClick={() => handleLibraryOnClick()}
                      disabled={ButtonState.disabled}
                    >
                      {ButtonState.text}
                    </button>
                  }
                </div>
                <div className="error-message">
                  {(mutationAddToLib.error || mutationRemoveFromLib.error) && (
                    <p>
                      Something went wrong! {mutationAddToLib.error?.message}
                      or {mutationRemoveFromLib.error?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-75 p-1">
                <div className="text-component">
                  <p className="card-text">{props.synopsis}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card font_set review-section mb-5 mt-1 rounded p-3 shadow">
            <div className="center-flex">
              <div className="review-section-inner">
                <div className="center-flex">
                  <h3>Write a review</h3>
                </div>
                <ReviewInput
                  review={ReviewState.review}
                  onSubmit={handleReviewOnSubmit}
                  disabled={ReviewState.disabled}
                />
                <div className="center-flex mt-3">
                  <h3> Reviews </h3>
                </div>
                {reviews_data_formatted?.map(
                  (
                    review: {
                      name: string;
                      review: string;
                      date: string;
                      rating: number;
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
        </div>
      </div>

      <style jsx>
        {`
          .card_body {
            display: flex;
          }
          .image_size {
            width: min(50%, 200px);
          }
          .font_set {
            font-size: clamp(0.8rem, 0.5vw + 0.5rem, 1rem);
          }
          .text-component {
            height: 300px;
            overflow: scroll;
          }
          .center-flex {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .button-size {
            width: min(50%, 200px);
          }
          .page-size {
            width: min(100%, 1200px);
          }
          .review-section {
            width: min(100%, 1200px);
          }
          .review-section-inner {
            width: min(100%, 1200px);
          }
        `}
      </style>
    </Layout>
  );
};

export default Book;
