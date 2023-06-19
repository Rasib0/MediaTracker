import React from "react";
import RatingStatic from "./rating_static";

type media = "movies" | "books";

export type Props = {
  by: string;
  review: string;
  date: string;
  rating: number;
};

const Review = (props: Props) => {
  return (
    <div className="m-1 p-4 border rounded-lg shadow-md">
      {props.date ? (
        <div className="text-sm text-gray-600 mb-2">
          Review by <b>{props.by}</b> on {props.date}
        </div>
      ) : null}
      {props.rating ? (
        <div className="flex items-center mb-2">
          <RatingStatic rating={props.rating} />
          <span className="ml-2 text-gray-600">{props.rating}/5</span>
        </div>
      ) : null}
      {props.review ? (
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-800">{props.review}</p>
        </div>
      ) : (
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">No review available</p>
        </div>
      )}
    </div>
  );
};

export default Review;
