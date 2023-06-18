import { FaStar } from "react-icons/fa";

type Props = {
  rating: number;
};
// a component that displays a static rating
const RatingStatic: React.FC<Props> = (props: Props) => {
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

export default RatingStatic;
