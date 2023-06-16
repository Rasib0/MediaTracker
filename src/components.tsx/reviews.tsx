import React from "react";
import Image from "next/image";
import Link from "next/link";
import RatingStatic from "./rating_static";

type media = "movies" | "books";

export type CardProps = {
  by: string;
  review: string;
  date: Date | null;
  rating: number | null;
};

const Card = (props: CardProps) => {
  return (
    <div className="m-1 mb-3 mt-2 max-h-[500px] max-w-[150px] rounded bg-white shadow">
      {props.date ? (
        <div>
          Review by <b>{props.by}</b> on {props.date.toString()}
        </div>
      ) : (
        <></>
      )}
      {props.rating ? (
        <div className="p-3">
          <RatingStatic rating={props.rating} />
        </div>
      ) : (
        <></>
      )}
      {!(props.review === "") ? (
        <p className="p-2">{props.review}</p>
      ) : (
        <em>no review</em>
      )}
    </div>
  );
};

export default Card;
