import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

type Props = {
  onClick: (rating: number) => Promise<void>;
  rating: number;
  disabled: boolean;
};
const RatingInput: React.FC<Props> = (props: Props) => {
  const [hover, setHover] = useState(props.rating);
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
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
      })}
    </div>
  );
};

export default RatingInput;
