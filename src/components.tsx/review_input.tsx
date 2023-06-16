import React, { useRef } from "react";

type Props = {
  onSubmit: (text: string) => Promise<void>;
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
          className="form-control mb-3"
          ref={inputRef}
          disabled={props.disabled}
          rows={3}
          placeholder="Write your review"
        />
        <div className="flex justify-center">
          <button
            className="submitButton"
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
