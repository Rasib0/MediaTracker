import React from "react";
import { RatingStatic } from "./rating";
import { useRef } from "react";

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
          className="w-full resize-none rounded-md border p-3 focus:border-blue-500 focus:outline-none focus:ring"
          ref={inputRef}
          disabled={props.disabled}
          rows={3}
          placeholder="Write your review"
        />
        <div className="flex justify-center">
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none"
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
  date: string;
  rating: number;
};

export const Review = (props: Props) => {
  return (
    <div className="m-1 rounded-lg border p-4 shadow-md">
      {props.date ? (
        <div className="mb-2 text-sm text-gray-600">
          Review by <b>{props.by}</b> on {props.date}
        </div>
      ) : null}
      {props.rating ? (
        <div className="mb-2 flex items-center">
          <RatingStatic rating={props.rating} />
          <span className="ml-2 text-gray-600">{props.rating}/5</span>
        </div>
      ) : null}
      {props.review ? (
        <div className="rounded-lg bg-gray-100 p-3">
          <p className="text-sm text-gray-800">{props.review}</p>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-100 p-3">
          <p className="text-sm text-gray-500">No review available</p>
        </div>
      )}
    </div>
  );
};
