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
  show_author: boolean;
  date: string | null;
  type: media;
  rating: number | null;
  media_url: string;
};

const OverviewCard = (props: CardProps) => {
  return (
    <Link
      className="mx-2 my-1 rounded shadow-lg  hover:bg-sky-200"
      href={"/" + props.type.slice(0, -1) + "/" + props.media_url}
    >
      <div className="flex w-full justify-center bg-slate-600 text-white">
        <div>{props.name}</div>
        &nbsp;
        {!!props.show_author ? <div>by {props.by}</div> : <></>}
      </div>
      {props.date ? (
        <p className="w-full font-thin">Added {props.date.toString()}</p>
      ) : (
        <></>
      )}
      {props.rating ? <RatingStatic rating={props.rating} /> : <></>}

      <div className="flex">
        <div className="m-1 min-w-[30%] max-w-[30%]">
          <Image
            src={"/images/" + props.type + "/" + props.image_url + ".jpg"}
            className="h-auto w-full rounded"
            width={250}
            height={500}
            alt="..."
          />
        </div>

        <div className="p-2">
          <p>{props.synopsis.substring(0, 300)}...</p>
        </div>
      </div>
    </Link>
  );
};

export default OverviewCard;
