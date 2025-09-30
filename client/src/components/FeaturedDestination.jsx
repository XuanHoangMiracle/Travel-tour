import React from 'react'
import { roomsDummyData } from '../assets/assets'
import TourCard from './TourCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'

const FeaturedDestination = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

    <Title title='ĐIỂM ĐẾN NỔI BẬT' subTitle='Khám phá những điểm đến đang được yêu thích'/>

        <div className='flex flex-wrap items-center justify-center w-full gap-6 mt-15'>
            {roomsDummyData.slice(0,4).map((room,index)=> (
                <TourCard key={room._id} room={room} index={index}/>
            ))}
        </div>
        <button onClick={()=>{navigate('/tours');scrollTo(0,0)}} 
        className='my-8 px-4 py-2 text-sm font-medium border border-gray-400 rounded bg-white 
        hover:bg-gray-50 transition-all cursor-pointer hover:bg-gray-300'>Xem tất cả tour</button>
    </div>
  )
}

export default FeaturedDestination