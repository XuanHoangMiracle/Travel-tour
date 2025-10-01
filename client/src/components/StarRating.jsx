import React from 'react'
import { assets } from '../assets/assets'

const StarRating = () => {
  return (
  <div className="flex items-center gap-1">
    <img src={assets.starIconFilled} alt="" />
    <img src={assets.starIconFilled} alt="" />
    <img src={assets.starIconFilled} alt="" />
    <img src={assets.starIconFilled} alt="" />
  </div>
)
}

export default StarRating