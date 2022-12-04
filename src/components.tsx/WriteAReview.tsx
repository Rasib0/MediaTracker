import React, { useRef, useState } from 'react'


type Props = {
  onSubmit: (text: string) => Promise<void>,
  review: string,
  disabled: boolean
}

const WriteAReview: React.FC<Props> = (props: Props) => {
  const inputRef = useRef()
 
  const onSubmitInner = (e) => {
    e.preventDefault()
    const value: string = inputRef?.current?.value

    if(value === "")  return
    props.onSubmit(value)
  }

  return (
    <div>
      <form  onSubmit={onSubmitInner}>
        <textarea className="form-control mb-3" ref={inputRef} disabled={props.disabled} type="text" rows={3} placeholder='Write your review'/>
        <button className="btn btn-secondary" type="submit" disabled={props.disabled}> Publish your Review</button>
      </form>

      <style jsx>
        {     
        `
        .submitButton {
          cursor: pointer;
          transition: 200ms;
        }
        `}
      </style>
    </div>
  )
}

export default WriteAReview