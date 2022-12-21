import React from "react";
import Image from "next/image";
import Link from "next/link";
import StaticRating from "./StaticRating";

type media = 'movies' | 'books'

export type CardProps = {
  by: string;
  review: string;
  date: Date | null;
  rating: number | null;
};

const OverviewCard: React.FC<CardProps> = (props: CardProps) => {
  return (
    <div className="card mb-3 mt-2 max_width m-1 shadow rounded ">
      {props.date ? <div>Review by <b>{props.by}</b> on {props.date.toString()} </div> :<></>}
        {props.rating ? <div className="p-3"><StaticRating rating={props.rating}/></div> :<></>}
        {!(props.review === "") ? <p className="card-text p-2">{props.review}</p>: <em>no review</em>}
        <style jsx>
          {`
          .max_width {
          min-height: 150px;
          max-height:500px;
          }
          `}
      </style>
    </div>
  );
};

export default OverviewCard;