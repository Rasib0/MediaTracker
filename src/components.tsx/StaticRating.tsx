import  { FaStar } from 'react-icons/fa'


type Props = {
  rating: number,
}

const StaticRating: React.FC<Props> = (props: Props) => {
  return (
    <div>
    {[...Array(5)].map((star, i) => {
      const ratingValue = i + 1;
      return (
          <FaStar key={i} className="star" 
                  color={(ratingValue <= (props.rating) ? "#ffc107": "#e4e5e9")} 
                  size={30}
          />
      )
    })}
  </div>
  )
}

export default StaticRating