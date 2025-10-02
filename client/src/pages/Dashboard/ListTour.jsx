import React from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'

const ListTour = () => {

    const [tour,setTour] = React.useState(roomsDummyData)

  return (
    <div>
        <Title align='left' font='outfit' title='Danh sách phòng' subTitle='Xem,sửa,xóa danh sách tour của bạn
        dễ dàng quản lý tất cả'/>
        <p className='text-gray-500 mt-8'>Tất cả tour</p>
        <div className='w-full max-w-3xl text-left border border-gray-300
          rounded-lg max-h-80 overflow-y-scroll mt-3'>
            <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='py-3 px-4 text-gray-800 font-medium'>Tour</th>
                    <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Dịch vụ</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-left'>Giá/người</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Update</th>
                  </tr>
                </thead>

                <tbody className='text-sm'>
                    {tour.map((item,index)=>(
                        <tr key={index}>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                {item.name}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                {item.amenities.join(', ')}
                            </td>
                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                {item.pricePerNight} vnđ
                            </td>
                            <td className='border-t border-gray-300'>
                                <img src="/setting.png" alt="Setting" className='h-5 cursor-pointer ml-12 mb-3'/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
    </div>
  )
}

export default ListTour