import React from "react";

type Props = {
  message: String;
};

const TextInput = (props: Props) => {
  return (
    <div className="flex h-[400px] w-full items-center justify-center text-3xl">
      {props.message}
    </div>
  );
};

export default TextInput;
