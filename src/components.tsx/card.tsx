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
      className="m-2 min-w-fit transform rounded border shadow-lg transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
      href={"/" + props.type.slice(0, -1) + "/" + props.media_url}
    >
      <div className="flex justify-center font-semibold">
        <div className="absolute hidden rounded bg-gray-100 p-2">
          Add to list
        </div>
        <div>{props.name}</div>
        &nbsp;
        {props.show_author && <div>by {props.by}</div>}
      </div>
      {props.date && <p className="font-thin">Added {props.date.toString()}</p>}
      {props.rating && <RatingStatic rating={props.rating} />}

      <div className="flex gap-2 border-t p-2">
        <Image
          src={"/images/" + props.type + "/" + props.image_url + ".jpg"}
          className="rounded "
          width={130}
          height={200}
          alt="..."
        />
        <div className="max-h-56 overflow-x-hidden overflow-y-scroll overflow-ellipsis p-2">
          {props.synopsis}
        </div>
      </div>
    </Link>
  );
};

export default OverviewCard;
