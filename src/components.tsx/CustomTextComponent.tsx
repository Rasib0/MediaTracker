import React from 'react'

type Props = {
  message: String
}

const CustomTextComponent = (props: Props) => {
  return (
    <div className="fit-width center-box text-settings">
      {props.message}
     <style jsx>{
      ` 
        .center-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text-settings {
          font-size: 30px;
        }
        .fit-width {
          width: 100%;
          height: 400px;
        }
      `}
      </style> 
    </div>
  )
}

export default CustomTextComponent