import React from 'react'

type media = 'movies' | 'books'

type Props = {
    image_url: string;
    disabled: boolean;
    name: string;
    by: string;
    synopsis: string;
    date: Date | null;
    type: media;
    rating: number | null;
    handleLibraryOnClick: any;
}

const MediaDetailCard = (props: Props) => {
  return (
    <div className="card mb-5 mt-1 font_set shadow rounded p-3">
    <div className="card_body">
      <div>
        <div className="mb-3 center-flex">
          <div className="image_size">
            <Image src={"/images/books/" + props.image_url + ".jpg"} className="img-fluid rounded" width={255} height={500} alt="..."></Image>
          </div>
          <StarRating rating={RatingState.rating}
            disabled={RatingState.disabled}
            onClick={handleRatingOnClick} />

          {<button className="btn btn-primary m-3"
            onClick={() => props.handleLibraryOnClick()}
            disabled={ButtonState.disabled}>{ButtonState.text}</button>}
        </div>
        <div className="error-message">{(mutationAddtoLib.error || mutationremoveFromLib.error)
          && <p>Something went wrong! {mutationAddtoLib.error?.message}
            or {mutationremoveFromLib.error?.message}</p>}
        </div>
      </div>

      <div className="p-1 w-75">
        <h5 className="card-title">{props.name}</h5>
        <p className="author">by {props.author}</p>
        <p className="card-text">{props.synopsis}</p>
      </div>
    </div>
  </div>
  )
}

export default MediaDetailCard