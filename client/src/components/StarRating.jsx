import React from 'react'
import { assets } from '../assets/assets'

const StarRating = ({ rating = 5, reviewCount = 0, showNumber = true }) => {
  // Tính số sao trung bình, làm tròn đến 0.5
  const averageRating = reviewCount > 0 ? Math.round(rating * 2) / 2 : 5;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 === 0.5;

  return (
    <div className="flex items-center gap-1">
      {/* Render stars */}
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          //  Full star
          return <img key={index} src={assets.starIconFilled} alt="star" className="w-4 h-4" />;
        } else if (index === fullStars && hasHalfStar) {
          //  hiển thị nửa sao
          return (
            <img key={index}  src="/halfstar.png" alt="half-star"  className="w-4 h-4" />
          );
        } else {
          // Empty star
          return <img key={index} src={assets.starIconFilled} alt="empty" className="w-4 h-4 opacity-30" />;
        }
      })}
      
      {showNumber && (
        <span className="text-sm font-medium text-gray-700 ml-1">
          {averageRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating
