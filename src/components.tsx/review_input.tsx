import React, { useRef } from "react";

type Props = {
  onSubmit: (text: string) => void;
  review: string;
  disabled: boolean;
};

const ReviewInput = (props: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitInner = (e: React.FormEvent) => {
    e.preventDefault();
    const value: string = inputRef?.current?.value ? inputRef?.current?.value : "";

    if (value === "") return;
    props.onSubmit(value);
  };

  return (
    <div>
      <form onSubmit={onSubmitInner}>
        <textarea
          className="p-3 border rounded-md w-full resize-none focus:outline-none focus:ring focus:border-blue-500"
          ref={inputRef}
          disabled={props.disabled}
          rows={3}
          placeholder="Write your review"
        />
        <div className="flex justify-center">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md font-semibold hover:bg-blue-600 focus:outline-none"
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

export default ReviewInput;
