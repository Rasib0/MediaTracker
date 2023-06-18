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
          className="mb-3"
          ref={inputRef}
          disabled={props.disabled}
          rows={3}
          placeholder="Write your review"
        />
        <div className="flex justify-center">
          <button
            className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
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
