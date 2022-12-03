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
        <label key={i}>
          <input 
            type="radio" 
            name="rating" 
            value={ratingValue} 
          />
          <FaStar className="star" 
                  color={(ratingValue <= (props.rating) ? "#ffc107": "#e4e5e9")} 
                  size={30}
          />
        </label>
      )
    })}
    <style jsx>
      {`
      input[type="radio"] {
        display: none
      }
      .star {
        cursor: pointer;
        transition: 200ms;
      }
      `}
    </style>
  </div>
  )
}

export default StaticRating