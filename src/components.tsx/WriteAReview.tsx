import React, { useRef } from 'react'


type Props = {
  onSubmit: (text: string) => Promise<void>,
  review: string,
  disabled: boolean
}

const WriteAReview: React.FC<Props> = (props: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
 
  const onSubmitInner = (e: any) => {
    e.preventDefault()
    const value: string = inputRef?.current?.value ?  inputRef?.current?.value : ""

    if(value === "")  return
    props.onSubmit(value)
  }

  return (
    <div>
      <form  onSubmit={(e) => onSubmitInner(e)}>
        <textarea className="form-control mb-3" ref={inputRef} disabled={props.disabled} rows={3} placeholder='Write your review'/>
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