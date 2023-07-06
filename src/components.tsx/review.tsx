import React from "react";
import { RatingStatic } from "./rating";
import { useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type WizardProps = {
  onSubmit: (text: string) => void;
  review: string;
  disabled: boolean;
};

export const WriteAReviewWizard = (props: WizardProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitInner = (e: React.FormEvent) => {
    e.preventDefault();
    const value: string = inputRef?.current?.value
      ? inputRef?.current?.value
      : "";

    if (value === "") return;
    props.onSubmit(value);
  };

  return (
    <div>
      <form onSubmit={onSubmitInner}>
        <textarea
          className="w-full resize-none rounded-md border p-3 focus:border-blue-500 focus:outline-none focus:ring dark:bg-gray-900 dark:text-gray-100"
          ref={inputRef}
          disabled={props.disabled}
          rows={3}
          placeholder="Write your review"
        />
        <div className="flex justify-center">
          <button
            className="w-full rounded-md bg-violet-400 px-8 py-3 font-semibold hover:bg-violet-600 disabled:bg-gray-500 dark:text-gray-900"
            type="submit"
            disabled={props.disabled}
          >
            Publish your Review
          </button>
        </div>
      </form>
    </div>
  );
};

type media = "movies" | "books";

type Props = {
  by: string;
  review: string;
  date: Date;
  rating: number;
};

export const Review = (props: Props) => {
  return (
    <div className="m-1 rounded-lg border p-4 shadow-md">
      {props.date ? (
        <div className="mb-2 text-sm">
          Review by <b>{props.by}</b>&nbsp;&bull;&nbsp;
          {dayjs(props.date).fromNow()}
        </div>
      ) : null}
      {props.rating ? (
        <div className="mb-2 flex items-center">
          <RatingStatic rating={props.rating} />
          <span className="ml-2 font-mono font-semibold">{props.rating}/5</span>
        </div>
      ) : null}
      {props.review ? (
        <div className="rounded-lgp-3">
          <p className="text-sm">{props.review}</p>
        </div>
      ) : (
        <div className="rounded-lgp-3">
          <p className="font-mono text-sm">
            This person left an empty review 😿
          </p>
        </div>
      )}
    </div>
  );
};
