import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from './StarRating';

const TourCard = ({ room, index }) => {
  return (
    <div className="bg-gradient-to-br from-amber-300/30 via-rose-300/20 to-fuchsia-300/20 p-[2px] rounded-2xl transition-all duration-300 w-[23%]">
      <Link
        to={'/tours/' + room._id}
        onClick={() => scrollTo(0, 0)}
        className="group block rounded-xl overflow-hidden bg-white text-gray-600 shadow-[0_3px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_5px_14px_rgba(0,0,0,0.08)] transition"
      >
        {/* Chia khung theo tỷ lệ 6/4 bằng grid; đặt chiều cao cố định để tỷ lệ ổn định */}
        <div className="grid grid-rows-[7fr_4fr] h-[310px] md:h-[330px]">

          {/* Ảnh (6 phần) */}
          <div className="relative row-span-1">
            <img
              src={room.images?.[0]}
              alt={room.hotel?.name || 'tour-img'}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {index % 2 === 0 && (
              <p className="px-2 py-0.5 absolute top-2 left-2 text-[10px] bg-white/90 backdrop-blur rounded-full text-gray-800 font-medium shadow">
                Best Seller
              </p>
            )}
          </div>

          {/* Thông tin (4 phần) */}
          <div className="row-span-1 p-3 flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <p className="flex-1 min-w-0 font-playfair text-lg md:text-xl font-semibold leading-tight
                whitespace-normal break-words line-clamp-4">
                {room.hotel?.name}
              </p>
              <StarRating />
            </div>
            <div className="flex items-center justify-between gap-2">
               <img src={assets.locationIcon} alt="location-icon" />
              <p className="flex-1 min-w-0 font-playfair text-base font-semibold leading-tight truncate">
                {room.hotel?.city}
              </p>

              <p className="shrink-0 text-right text-[12px] font-medium text-gray-800 whitespace-nowrap leading-tight">
                {room.pricePerNight}{' '}
                <span className="text-gray-500">vnđ/người</span>
              </p>
            </div>

            {/* CTA Đặt ngay: nằm dưới giá tiền, có hiệu ứng hover */}
            <span
              role="button"
              className="mt-auto inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium
                         rounded-lg bg-black/80 text-white
                         transition-transform duration-200
                         hover:bg-black group-hover:translate-y-[-1px] group-hover:shadow
                         active:translate-y-0"
            >
              Đặt ngay
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TourCard;
