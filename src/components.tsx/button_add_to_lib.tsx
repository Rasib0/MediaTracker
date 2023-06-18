import React from "react";

type Props = {
  text: string;
};

const ButtonAddToLib = (props: Props) => {
  return <div>{props.text}</div>;
};

export default ButtonAddToLib;
