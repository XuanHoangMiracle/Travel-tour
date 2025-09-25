// TourCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const TourCard = ({ room, index }) => {
  return (
    <div className="bg-gradient-to-br from-amber-300/30 via-rose-300/20 to-fuchsia-300/20 p-[2px] rounded-2xl transition-all duration-300">
      <Link
        to={`/tours/${room.id}`}
        onClick={() => scrollTo(0, 0)}
        className="relative block w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
      >
        <img src={room.images[0]} alt="" className="w-full h-48 object-cover" />

        {index % 2 === 0 && (
          <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
            Best Seller
          </p>
        )}

        <div className="p-4 pt-5">
          <div className="flex items-center justify-between">
            <p className="font-playfair text-xl font-medium text-gray-800">{room.hotel.name}</p>
            <div className="flex items-center gap-1">
              <img src={assets.starIconFilled} alt="star" className="h-4 w-4" /> 4.5
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm mt-1">
            <img src={assets.locationIcon} alt="location" className="h-4 w-4" />
            <span>{room.hotel.address}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xl text-gray-800">
              {room.pricePerNight}
              <span className="ml-1">vnd</span>
            </p>
            <button className="px-4 py-2 text-gray-500 cursor-pointer font-medium border border-b-black rounded hover:bg-gray-300 transition-all">
              Đặt ngay
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default TourCard
