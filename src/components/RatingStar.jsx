import React from "react";
import { AiFillStar } from "react-icons/ai";

export default function RatingStar({rating}) {

    if(!rating)
        return (
            <p className=" dark:text-highlight-dark text-highlight">No Review</p>
        )

  return (
    <p className=" text-highlight dark:text-highlight-dark flex items-center space-x-1">
      <span>{rating}</span>
      <AiFillStar/>
    </p>
  );
}
