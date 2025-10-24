import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
    const { currency, user, axios, getToken } = useAppContext();

    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
    })

    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    return (
        <div>
            <Title 
                align='left' 
                font='outfit' 
                title='Bảng điều khiển' 
                subTitle='Nơi quản lý tour của Travel Tours'
            />
            
            <div className='flex gap-4 my-8'>
                {/* Tổng số booking tour */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10'/>
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Tổng số tour</p>
                        <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
                    </div>
                </div>
                
                {/* Tổng doanh thu */}
                <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                    <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10'/>
                    <div className='flex flex-col sm:ml-4 font-medium'>
                        <p className='text-blue-500 text-lg'>Doanh thu</p>
                        <p className='text-neutral-400 text-base'>
                            {dashboardData.totalRevenue.toLocaleString('vi-VN')} {currency}
                        </p>
                    </div>
                </div>
            </div>

            {/* Booking gần đây */}
            <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Booking gần đây</h2>
            <div className='w-full text-left border border-gray-300 rounded-lg max-h-96 overflow-y-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50 sticky top-0'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left'>Tên khách</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left max-sm:hidden'>Tour</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left max-md:hidden'>Ngày đặt</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Tổng tiền</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm'> 
                        {dashboardData.bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className='py-8 text-center text-gray-500'>
                                    Chưa có booking nào
                                </td>
                            </tr>
                        ) : (
                            dashboardData.bookings.map((item, index) => (
                                <tr key={index} className='hover:bg-gray-50'>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                        {item.user?.username || item.user?.email || 'N/A'}
                                    </td>

                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                                        {item.tour?.name || 'N/A'}
                                    </td>

                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-md:hidden'>
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                    </td>

                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                        {item.totalPrice?.toLocaleString('vi-VN')} {currency}
                                    </td>

                                    <td className='py-3 px-4 border-t border-gray-300'>
                                        <div className='flex justify-center'>
                                            <button 
                                                className={`py-1 px-3 text-xs rounded-full ${
                                                    item.isPaid 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-yellow-300 text-gray-800'
                                                }`}
                                            >
                                                {item.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard
