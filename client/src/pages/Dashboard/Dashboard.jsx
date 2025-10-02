import React from 'react'
import Title from '../../components/Title'
import { assets, dashboardDummyData } from '../../assets/assets'

const Dashboard = () => {

  const [dashboardData,setDashboardData] = React.useState(dashboardDummyData)
  return (
    <div>
        <Title align='left' font='outfit' title='Bảng điều khiển' subTitle='Nơi quản lý tour của Travel Tours'/>
        <div className='flex gap-4 my-8'>
          {/* số tour*/}
          <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
            <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
            <div className='flex flex-col sm:ml-4 font-medium'>
              <p className='text-blue-500 text-lg'>Tổng Tour</p>
              <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
            </div>
          </div>
          {/* Total Revenue*/}
          <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
            <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
            <div className='flex flex-col sm:ml-4 font-medium'>
              <p className='text-blue-500 text-lg'>Doanh thu</p>
              <p className='text-neutral-400 text-base'>${dashboardData.totalRevenue}</p>
            </div>
          </div>
        </div>

          {/* Các tour gần đây*/}
          <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Tour gần đây</h2>
          <div className='w-full max-w-3xl text-left border border-gray-300
          rounded-lg max-h-80 overflow-y-scroll'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='py-3 px-4 text-gray-800 font-medium'>Tên người đặt</th>
                    <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Tour</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Tổng tiền</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-center'>Trạng thái</th>
                  </tr>
                </thead>

                <tbody className='text-sm'> 
                  {dashboardData.bookings.map((item,index)=>(
                    <tr key={index}>
                      <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                        {item.user.username}
                      </td>

                      <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                        {item.room.name}
                      </td>

                      <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                        {item.totalPrice} vnđ
                      </td>

                      <td className='py-3 px-4 border-t border-gray-300 flex'>
                        <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? 'bg-green-500' : 'bg-yellow-300'}
                        `}>
                          {item.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
          </div>

    </div>
  )
}

export default Dashboard