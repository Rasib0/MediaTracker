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
    <div className="card mb-3 mt-2 max_width col m-1 shadow rounded ">
      {props.date ? <div className="card-text">Review by <b>{props.by}</b> on {props.date.toString()} </div> :<></>}

      <div className="row g-0">
        <div className="col-md-8">
        {props.rating ? <div><StaticRating rating={props.rating}/></div> :<></>}
          <div className="card-body">
            {!(props.review === "") ? <p className="card-text">{props.review}</p>: <em>no review</em>}
          </div>
        </div>
      </div>
        <style jsx>
          {`
          .max_width {
          max-height:500px;
          overflow: hidden;
          }
          `}
      </style>
    </div>
  );
};

export default OverviewCard;