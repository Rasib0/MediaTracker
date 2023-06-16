import React from "react";
import Image from "next/image";
import Link from "next/link";
import RatingStatic from "./rating_static";

type media = "movies" | "books";

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

const OverviewCard = (props: CardProps) => {
  return (
    <Link
      className="mx-2 my-1 rounded shadow-lg"
      href={"/" + props.type.slice(0, -1) + "/" + props.media_url}
    >
      {props.date ? <div>Added on {props.date.toString()}</div> : <></>}
      <div className="flex hover:bg-sky-200">
        <div className="m-1 min-w-[30%] max-w-[30%]">
          <Image
            src={"/images/" + props.type + "/" + props.image_url + ".jpg"}
            className="h-auto w-full rounded"
            width={250}
            height={500}
            alt="..."
          />
        </div>

        <div className="p-3">
          <h5>{props.name}</h5>

          <div>
            <em>by {props.by}</em>
          </div>

          <p>{props.synopsis.substring(0, 300)}...</p>
          {props.rating ? (
            <div>
              <RatingStatic rating={props.rating} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OverviewCard;
