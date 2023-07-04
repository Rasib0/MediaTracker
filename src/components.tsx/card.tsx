import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RatingStatic } from "./rating";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type media = "movies" | "books";

export type CardProps = {
  name: string;
  by: string;
  synopsis: string;
  image_url: string;
  show_author: boolean;
  date: Date | null;
  type: media;
  rating: number | null;
  media_url: string;
};

const Card = (props: CardProps) => {
  return (
    <Link
      className="m-2 min-w-fit transform rounded border shadow-lg transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
      href={"/" + props.type.slice(0, -1) + "/" + props.media_url}
    >
      <div className="flex justify-center font-semibold">
        <div>{props.name}</div>
        &nbsp;
        {props.show_author && <div>by {props.by}</div>}
      </div>
      <div className="flex justify-between border border-black from-purple-600 to-purple-700 px-2 py-1 dark:bg-gradient-to-r">
        {props.rating && <RatingStatic rating={props.rating} />}

        {props.date && (
          <p className="font-thin">Added {dayjs(props.date).fromNow()}</p>
        )}
      </div>
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

export default Card;
