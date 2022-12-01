import React, { useState } from 'react'
import  { FaStar } from 'react-icons/fa'


type Props = {
  onClick: (rating: number) => Promise<void>,
  rating: number,
  disabled: boolean
}

const StarRating: React.FC<Props> = (props: Props) => {
  const [hover, setHover] = useState(props.rating)
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
              disabled = {props.disabled}
              onClick = {() => {
                if(!props.disabled) {
                  props.onClick(ratingValue)
                }
                }}/>
            <FaStar className="star" 
                    color={(ratingValue <= (hover || props.rating) ? "#ffc107": "#e4e5e9")} 
                    size={30}
                    onMouseEnter = { () => props.disabled ?setHover(NaN): setHover(ratingValue)}              
                    onMouseLeave = { () => setHover(NaN)}
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

export default StarRating