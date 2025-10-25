import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from './StarRating';
import { useAppContext } from '../context/AppContext';

const TourCard = ({ tour, index }) => {
  const { currency } = useAppContext();

  return (
    <div className="bg-gradient-to-br from-amber-300/30 via-rose-300/20 to-fuchsia-300/20 p-[2px] rounded-2xl transition-all duration-300 w-[23%]">
      <Link
        to={'/tours/' + tour._id}
        onClick={() => scrollTo(0, 0)}
        className="group block rounded-xl overflow-hidden bg-white text-gray-600 shadow-[0_3px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_5px_14px_rgba(0,0,0,0.08)] transition"
      >
        <div className="grid grid-rows-[6fr_5fr] h-[350px] md:h-[370px]">

          {/* Ảnh (6 phần) */}
          <div className="relative row-span-1">
            <img
              src={tour.images?.[0] || assets.uploadArea} 
              alt={tour.name || 'tour-img'} 
              className="absolute inset-0 h-full w-full object-cover"
            />
            {index % 2 === 0 && (
              <p className="px-2 py-0.5 absolute top-2 left-2 text-[10px] bg-white/90 backdrop-blur rounded-full text-gray-800 font-medium shadow">
                Best Seller
              </p>
            )}
          </div>

          {/* Thông tin (5 phần - tăng từ 4 lên 5) */}
          <div className="row-span-1 p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="flex-1 min-w-0 font-times text-[15px] md:text-base font-semibold leading-snug
                text-gray-800 line-clamp-2 h-[42px]">
                {tour.name}  
              </h3>
              <div className="shrink-0 mt-0.5">
                 <StarRating rating={tour.averageRating} reviewCount={tour.reviewCount} />
              </div>
            </div>
            
            {/* Vị trí & Giá */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <img src={assets.locationIcon} alt="location-icon" className="h-3.5 w-3.5 shrink-0" />
                <p className="text-xs font-medium leading-tight truncate text-gray-600">
                  {tour.location} 
                </p>
              </div>

              <p className="shrink-0 text-right text-[11px] font-semibold text-gray-800 whitespace-nowrap leading-tight">
                {tour.price?.toLocaleString('vi-VN')}{' '}
                <span className="text-gray-500 font-normal">{currency}</span>
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 text-[11px] text-gray-600">
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span className="font-medium">{tour.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <img src={assets.guestsIcon} alt="" className="h-3 w-3" />
                <span className="font-medium">{tour.guest} khách</span> 
              </div>
            </div>

            <button
              className="mt-auto inline-flex items-center justify-center px-3 py-2 text-xs font-semibold
                         rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white
                         transition-all duration-200
                         hover:from-blue-600 hover:to-cyan-950 group-hover:translate-y-[-1px] group-hover:shadow-md
                         active:translate-y-0"
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TourCard;
