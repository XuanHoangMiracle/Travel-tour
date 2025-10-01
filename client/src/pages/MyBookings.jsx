import React, { useState } from 'react'
import Title from '../components/Title'
import { assets, userBookingsDummyData } from '../assets/assets'
import { use } from 'react'

const MyBookings = () => {

  const [bookings,setBookings] = useState(userBookingsDummyData)

  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-2 xl:px-32'>
        <Title title='Tours của tôi' subTitle='Dễ dàng quan lý các tour của bạn,lên kế hoạch cho chuyến đi sắp tới của bạn chỉ với vài thao tác'align='left'/>
        <div className='max-w-6xl mt-8 w-full text-gray-800'>

          <div className="hidden md:grid md:grid-cols-[4fr_3fr_2fr_1fr] w-full border-b border-gray-300
             font-medium text-base py-3 items-center gap-4 whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis ml-15">Tour</div>
          <div className="overflow-hidden text-ellipsis  ml-15">Ngày khởi hành</div>
          <div className="overflow-hidden text-ellipsis">Số lượng khách</div>
          <div className="overflow-hidden text-ellipsis">Trạng thái</div>
        </div>
        {bookings.map((bookings)=>(
          <div key={bookings._id} className='grid grid-cols-1 md:grid-cols-[4fr_3fr_2fr_1fr] 
          border-b border-gray-300 py-6 first:border-t'>
            {/*chi tiết*/}
            <div className='flex flex-col md:flex-row'>
              <img src={bookings.room.images[0]} alt="tour-img" 
                  className='min-md:w-44 rounded shadow object-cover'/>
              <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                <p className='font-playfair text-2xl leading-tight break-words line-clamp-4'>
                  {bookings.hotel.name}
                </p>

                <p className="font-inter text-sm flex items-center gap-2">
                  <img src={assets.locationIcon} alt="" className="h-4 w-4" />
                  {bookings.room.tourLocation}
                </p>

                <p className='text-base'>Tổng: ${bookings.totalPrice}</p>
              </div>
            </div>
            {/* Thời gian khởi hành*/}
            <div className='flex flex-row md:items-center md:gap-12 mt-1 ml-15 gap-8'>
              <div>
                <p className='text-gray-500 text-sm'>
                  {new Date(bookings.checkInDate).toDateString()}
                </p>
              </div>
              
            </div>
            {/* Số khách*/}
            <div>
              <div className='flex items-center gap-1 text-sm text-gray-500 ml-5 mt-20'>  
                  <img src={assets.guestsIcon} alt="guests-icon" />
                  <span>Khách: {bookings.guests}</span>
                </div>
            </div>
            {/*Trạng thái*/}
            <div className="flex items-center justify-start pt-3">
              <div className="inline-flex items-center gap-2 flex-nowrap">
                <div className={`h-4 w-3 rounded-full ${bookings.isPaid ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className={`text-sm whitespace-nowrap ${bookings.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                  {bookings.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
              </div>
            </div>
            {!bookings.isPaid && (
                <button className="mt-2 px-4 py-1.5 text-xs border border-gray-400 rounded-full
                 hover:bg-gray-50 transition-all cursor-pointer w-45">Thanh Toán</button>
                )}
          </div>
        ))}
        </div>
    </div>
  )
}

export default MyBookings