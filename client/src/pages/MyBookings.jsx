import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const { axios, getToken, currency, user } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch bookings của user
    const fetchBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/my-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setBookings(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi tải bookings');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Hủy booking
    const handleCancel = async (bookingId) => {
        if (!confirm('Bạn có chắc muốn hủy booking này?')) return;

        try {
            const { data } = await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                fetchBookings(); // Refresh lại danh sách
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi hủy booking');
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) {
        return (
            <div className='py-28 md:pb-35 md:pt-32 px-4 text-center'>
                <p className='text-gray-500'>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-2 xl:px-32'>
            <Title 
                title='Tours của tôi' 
                subTitle='Dễ dàng quản lý các tour của bạn, lên kế hoạch cho chuyến đi sắp tới của bạn chỉ với vài thao tác'
                align='left'
            />
            
            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                {/* Header */}
                <div className="hidden md:grid md:grid-cols-[4fr_3fr_2fr_1fr] w-full border-b border-gray-300
                    font-medium text-base py-3 items-center gap-4 whitespace-nowrap">
                    <div className="overflow-hidden text-ellipsis ml-15">Tour</div>
                    <div className="overflow-hidden text-ellipsis ml-15">Ngày khởi hành</div>
                    <div className="overflow-hidden text-ellipsis">Số lượng khách</div>
                    <div className="overflow-hidden text-ellipsis">Trạng thái</div>
                </div>

                {/* Empty state */}
                {bookings.length === 0 ? (
                    <div className='py-16 text-center'>
                        <p className='text-gray-500 text-lg'>Bạn chưa có booking nào</p>
                        <button 
                            onClick={() => window.location.href = '/tours'}
                            className='mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            Khám phá tour
                        </button>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div 
                            key={booking._id} 
                            className='grid grid-cols-1 md:grid-cols-[4fr_3fr_2fr_1fr] 
                            border-b border-gray-300 py-6 first:border-t'
                        >
                            {/* Chi tiết tour */}
                            <div className='flex flex-col md:flex-row'>
                                <img 
                                    src={booking.tour?.images?.[0] || assets.uploadArea} 
                                    alt="tour-img" 
                                    className='min-md:w-44 h-32 rounded shadow object-cover'
                                />
                                <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                    <p className='font-playfair text-2xl leading-tight break-words line-clamp-2'>
                                        {booking.tour?.name || 'N/A'}
                                    </p>

                                    <p className="font-inter text-sm flex items-center gap-2">
                                        <img src={assets.locationIcon} alt="" className="h-4 w-4" />
                                        {booking.tour?.location || 'N/A'}
                                    </p>

                                    <p className='text-sm text-gray-600'>
                                        ⏱️ {booking.tour?.time || 'N/A'}
                                    </p>

                                    <p className='text-base font-semibold'>
                                        Tổng: {booking.totalPrice?.toLocaleString('vi-VN')} {currency}
                                    </p>
                                </div>
                            </div>

                            {/* Ngày khởi hành */}
                            <div className='flex flex-row md:items-center md:gap-12 mt-1 ml-15 gap-8'>
                                <div>
                                    <p className='text-gray-500 text-sm'>
                                        {new Date(booking.bookingDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className='text-xs text-gray-400 mt-1'>
                                        Đặt ngày: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            {/* Số khách */}
                            <div>
                                <div className='flex items-center gap-1 text-sm text-gray-500 ml-5 mt-20'>  
                                    <img src={assets.guestsIcon} alt="guests-icon" className='h-4 w-4' />
                                    <span>Khách: {booking.numberOfGuests}</span>
                                </div>
                            </div>

                            {/* Trạng thái */}
                            <div className="flex flex-col items-start justify-start pt-3 gap-2">
                                <div className="inline-flex items-center gap-2 flex-nowrap">
                                    <div className={`h-4 w-3 rounded-full ${
                                        booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                    <p className={`text-sm whitespace-nowrap ${
                                        booking.isPaid ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {booking.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </p>
                                </div>

                                {/* Badge trạng thái booking */}
                                <span className={`text-xs px-2 py-1 rounded ${
                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                     booking.status === 'cancelled' ? 'Đã hủy' :
                                     booking.status === 'completed' ? 'Hoàn thành' :
                                     'Chờ xử lý'}
                                </span>

                                {/* Nút thanh toán/hủy */}
                                {!booking.isPaid && booking.status !== 'cancelled' && (
                                    <div className='flex flex-col gap-2 mt-2'>
                                        <button className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-full
                                            hover:bg-blue-600 transition-all cursor-pointer whitespace-nowrap">
                                            Thanh toán
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(booking._id)}
                                            className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full
                                            hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap">
                                            Hủy booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyBookings
