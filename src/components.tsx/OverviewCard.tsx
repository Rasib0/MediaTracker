import React from "react";
import Image from "next/image";
import Link from "next/link";
import StaticRating from "./StaticRating";

type media = 'movies' | 'books'

export type CardProps = {
  name: string;
  by: string;
  synopsis: string;
  image_url: string;
  date: Date | null;
  type: media;
  rating: number | null;
  book_url: string;
};

const OverviewCard: React.FC<CardProps> = (props: CardProps) => {
  return (
    <div className="card mb-3 mt-2 max_width col m-1 shadow rounded ">
      {props.date ? <div className="card-text">Added on {props.date.toString()}</div> :<></>}

      <div className="row g-0">
        <div className="col mt-2 mb-1">
          <Image src={"/images/"+props.type+"/" + props.image_url + ".jpg"} className="img-fluid rounded" width={255} height={500} alt="..."></Image>
          <Link href={"/book/" + props.book_url} passHref legacyBehavior><a className="stretched-link"> </a></Link>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{props.name} </h5>
            <div className="card-text"><em>by  {props.by}</em> </div>
            <p className="card-text">{props.synopsis.substring(0, 150)}...</p>
            {props.rating ? <div className="card-text"><StaticRating rating={props.rating}/></div> :<></>}
          </div>
        </div>
      </div>
        <style jsx>
          {`
          .max_width {
          min-width: 350px;
          max-width: 400px;
          max-height:500px;
          overflow: hidden;
          }
          `}
      </style>
    </div>
  );
};

export default OverviewCard;