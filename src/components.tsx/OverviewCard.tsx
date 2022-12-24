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
  media_url: string;
};

const OverviewCard: React.FC<CardProps> = (props: CardProps) => {
  return (
    <div className="card mb-1 mt-1 m-1 font_set shadow rounded ">
      {props.date ? <div className="card-text">Added on {props.date.toString()}</div> :<></>}
      <div className="card_body">
        <div className="m-1 image_size">
          <Image src={"/images/"+props.type+"/" + props.image_url + ".jpg"} className="img-fluid rounded" width={250} height={500} alt="..."></Image>
          <Link href={"/"+props.type.slice(0, -1)+"/" + props.media_url} passHref legacyBehavior><a className="stretched-link"> </a></Link>
        </div>
          <div className="p-3">
            <h5 className="card-title">{props.name} </h5>
            <div className="card-text"><em>by  {props.by}</em> </div>
            <p className="card-text">{props.synopsis.substring(0, 250)}...</p>
            {props.rating ? <div className="card-text"><StaticRating rating={props.rating}/></div> :<></>}
        </div>
      </div>
        <style jsx>
          {`
          .card_body {
            display: flex;
          }
          .image_size {
            min-width: max(30%, 80px);
            max-width: min(30%, 100px);
          }
          .font_set {
            font-size: clamp(0.7rem, 0.5vw + 0.5rem, 0.8rem);
          }
          `}
      </style>
    </div>
  );
};

export default OverviewCard;