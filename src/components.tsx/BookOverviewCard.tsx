import React from "react";
import Image from "next/image";
import Link from "next/link";

export type PostProps = {
  title: String;
  by: String;
  synopsis: String;
  image_url: String;
  date: boolean;
  book_url: String;
};

const BookOverviewCard: React.FC<{ props: PostProps }> = ({ props }) => {
  return (
<div className="card mb-3 mt-2 max_width col m-1 shadow rounded ">
                      <div className="row g-0">
                        <div className="col mt-2 mb-1">
                          <Image src={"/images/" + props.image_url + ".jpg"} className="img-fluid rounded" width={255} height={500} alt="..."></Image>
                          <Link href={"/book/" + props.book_url} passHref legacyBehavior><a className="btn btn-primary stretched-link ml-1">Read more</a></Link>
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{props.title}</h5>
                            <div className="card-text">by {props.by} </div>
                            <p className="card-text">{props.synopsis.substring(0, 150)}... read more</p>
                            <div className="card-text">props.date</div>
                          </div>
                        </div>
                      </div>
                  </div>
  );
};

export default BookOverviewCard;