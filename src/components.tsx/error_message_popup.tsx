import React from "react";

type Props = {
  errorMessage: string;
};

const ErrorMessagePopup = (props: Props) => {
  return <div>{props.errorMessage}</div>;
};

export default ErrorMessagePopup;
