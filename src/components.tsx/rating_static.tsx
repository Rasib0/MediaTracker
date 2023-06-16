import { FaStar } from "react-icons/fa";

type Props = {
  rating: number;
};
// a component that displays a static rating
const RatingStatic: React.FC<Props> = (props: Props) => {
  return (
    <div>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <FaStar
            key={i}
            color={ratingValue <= props.rating ? "#ffc107" : "#e4e5e9"}
            size={25}
          />
        );
      })}
    </div>
  );
};

export default RatingStatic;
