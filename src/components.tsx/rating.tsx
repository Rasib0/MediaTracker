import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

type PropsInput = {
  onClick: (rating: number) => void;
  rating: number;
  disabled: boolean;
};

export const RatingInput = (props: PropsInput) => {
  const [hover, setHover] = useState(props.rating);
  return (
    <div className="flex">
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                className="hidden"
                value={ratingValue}
                disabled={props.disabled}
                onClick={() => {
                  if (!props.disabled) {
                    props.onClick(ratingValue);
                  }
                }}
              />
              <FaStar
                className="star"
                color={
                  ratingValue <= (hover || props.rating) ? "#ffc107" : "#e4e5e9"
                }
                size={25}
                onMouseEnter={() =>
                  props.disabled ? setHover(NaN) : setHover(ratingValue)
                }
                onMouseLeave={() => setHover(NaN)}
              />
            </label>
          );
        })
      }
    </div>
  );
};

type PropsStatic = {
  rating: number;
};
// a component that displays a static rating
export const RatingStatic: React.FC<PropsStatic> = (props: PropsStatic) => {
  return (
    <span className="flex">
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <FaStar
              key={i}
              color={ratingValue <= props.rating ? "#ffc107" : "#e4e5e9"}
              size={25}
            />
          );
        })
      }
    </span>
  );
};
