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
        stats: {
            paidBookings: 0,
            unpaidBookings: 0,
            pendingBookings: 0,
            confirmedBookings: 0,
            cancelledBookings: 0,
            completedBookings: 0,
            totalTours: 0,
            availableTours: 0,
            totalGuests: 0,
            avgBookingValue: 0
        },
        topTours: [],
        recentUsers: []
    })

    const [updating, setUpdating] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = await getToken();
            
            if (!token) {
                throw new Error('Không có token xác thực');
            }

            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Dashboard data received:', data);

            if (data.success) {
                setDashboardData(data.dashboardData || {
                    bookings: [],
                    totalBookings: 0,
                    totalRevenue: 0,
                    stats: {
                        paidBookings: 0,
                        unpaidBookings: 0,
                        pendingBookings: 0,
                        confirmedBookings: 0,
                        cancelledBookings: 0,
                        completedBookings: 0,
                        totalTours: 0,
                        availableTours: 0,
                        totalGuests: 0,
                        avgBookingValue: 0
                    },
                    topTours: [],
                    recentUsers: []
                });
            } else {
                throw new Error(data.message || 'Lỗi tải dữ liệu');
            }
        } catch (error) {
            console.error('fetchDashboardData error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi tải dữ liệu';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleTogglePayment = async (bookingId, currentStatus) => {
        setUpdating(true);
        try {
            const { data } = await axios.put(
                `/api/admin/bookings/${bookingId}/payment`,
                { isPaid: !currentStatus },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                await fetchDashboardData();
            }
        } catch (error) {
            console.error('handleTogglePayment error:', error);
            toast.error(error.response?.data?.message || 'Lỗi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangeStatus = async (bookingId, newStatus) => {
        setUpdating(true);
        try {
            const { data } = await axios.put(
                `/api/admin/bookings/${bookingId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(`Đã cập nhật trạng thái: ${
                    newStatus === 'completed' ? 'Hoàn thành' :
                    newStatus === 'confirmed' ? 'Đã xác nhận' :
                    newStatus === 'cancelled' ? 'Đã hủy' : 'Chờ xử lý'
                }`);
                await fetchDashboardData();
                if (showContactModal && selectedBooking?._id === bookingId) {
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                }
            }
        } catch (error) {
            console.error('handleChangeStatus error:', error);
            toast.error(error.response?.data?.message || 'Lỗi cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const handleViewContact = (booking) => {
        setSelectedBooking(booking);
        setShowContactModal(true);
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }
    }, [user])

    // LOADING STATE
    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                    <p className='text-gray-500 mt-4'>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // ERROR STATE
    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md'>
                    <div className='text-5xl mb-4'>⚠️</div>
                    <h3 className='text-xl font-bold text-red-800 mb-2'>Lỗi tải dữ liệu</h3>
                    <p className='text-red-600 mb-4'>{error}</p>
                    <button 
                        onClick={fetchDashboardData}
                        className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Title 
                align='left' 
                font='outfit' 
                title='Bảng điều khiển' 
                subTitle='Nơi quản lý tour của Travel Tours'
            />
            
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8'>
                {/* Tổng số booking */}
                <div className='bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-blue-600 text-sm font-medium mb-1'>Tổng Bookings</p>
                            <p className='text-3xl font-bold text-blue-900'>{dashboardData.totalBookings || 0}</p>
                            <p className='text-xs text-blue-600 mt-1'>
                                Tổng số khách {dashboardData.stats?.totalGuests || 0}
                            </p>
                        </div>
                        <img src={assets.totalBookingIcon} alt="" className='h-12 opacity-80'/>
                    </div>
                </div>
                
                {/* Doanh thu */}
                <div className='bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-green-600 text-sm font-medium mb-1'>Doanh Thu</p>
                            <p className='text-xl font-bold text-green-900 truncate'>
                                {(dashboardData.totalRevenue || 0).toLocaleString('vi-VN')}
                            </p>
                            <p className='text-xs text-gray-600 mt-0.5'>{currency}</p>
                        </div>
                        <img src={assets.totalRevenueIcon} alt="" className='h-12 opacity-80'/>
                    </div>
                </div>

                {/* Trạng thái thanh toán */}
                <div className='bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-yellow-600 text-sm font-medium mb-1'>Chờ Thanh Toán</p>
                            <p className='text-3xl font-bold text-yellow-900'>
                                {dashboardData.stats?.unpaidBookings || 0}
                            </p>
                            <p className='text-xs text-green-600 mt-1'>
                                ✓ {dashboardData.stats?.paidBookings || 0} đã thanh toán
                            </p>
                        </div>
                        <div className='text-4xl'>⏳</div>
                    </div>
                </div>

                {/* Tours */}
                <div className='bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-purple-600 text-sm font-medium mb-1'>Tổng Tours</p>
                            <p className='text-3xl font-bold text-purple-900'>
                                {dashboardData.stats?.totalTours || 0}
                            </p>
                        </div>
                        <div className='text-4xl'>🗺️</div>
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                <div className='bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow'>
                    <p className='text-2xl font-bold text-gray-700'>{dashboardData.stats?.pendingBookings || 0}</p>
                    <p className='text-sm text-gray-500'>Chờ xử lý</p>
                </div>
                <div className='bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow'>
                    <p className='text-2xl font-bold text-blue-600'>{dashboardData.stats?.confirmedBookings || 0}</p>
                    <p className='text-sm text-gray-500'>Đã xác nhận</p>
                </div>
                <div className='bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow'>
                    <p className='text-2xl font-bold text-green-600'>{dashboardData.stats?.completedBookings || 0}</p>
                    <p className='text-sm text-gray-500'>Hoàn thành</p>
                </div>
                <div className='bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow'>
                    <p className='text-2xl font-bold text-red-600'>{dashboardData.stats?.cancelledBookings || 0}</p>
                    <p className='text-sm text-gray-500'>Đã hủy</p>
                </div>
            </div>

            {/* Top Tours */}
            {dashboardData.topTours?.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-xl text-blue-950/70 font-semibold mb-4'>Top Tours Được Đặt</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                        {dashboardData.topTours.map((item, index) => (
                            <div key={index} className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
                                <div className='flex items-start gap-3'>
                                    <div className='bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0'>
                                        #{index + 1}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-sm text-gray-900 truncate'>
                                            {item.tourInfo?.name || 'N/A'}
                                        </h3>
                                        <p className='text-xs text-gray-500 truncate'>{item.tourInfo?.location || 'N/A'}</p>
                                        <div className='flex justify-between mt-2 text-xs'>
                                            <span className='text-blue-600 font-medium'>
                                                {item.bookingCount || 0} bookings
                                            </span>
                                            <span className='text-green-600 font-medium'>
                                                {(item.totalRevenue || 0).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Table */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
                <div className='px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-xl text-blue-950/70 font-semibold'>Booking Gần Đây</h2>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='py-3 px-4 text-gray-800 font-medium text-left'>Khách hàng</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-left max-lg:hidden'>Tour</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-center max-md:hidden'>Ngày đi</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-center max-sm:hidden'>Số khách</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Tổng tiền</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Trạng thái</th>
                                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className='text-sm divide-y divide-gray-200'> 
                            {!dashboardData.bookings || dashboardData.bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className='py-12 text-center text-gray-500'>
                                        <div className='flex flex-col items-center'>
                                            <div className='text-4xl mb-2'>📋</div>
                                            <p>Chưa có booking nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                dashboardData.bookings.map((item) => (
                                    <tr key={item._id} className='hover:bg-gray-50 transition-colors'>
                                        <td className='py-3 px-4 text-gray-700'>
                                            <div className='flex items-center gap-2'>
                                                {item.user?.image && (
                                                    <img 
                                                        src={item.user.image} 
                                                        alt="user" 
                                                        className='w-10 h-10 rounded-full object-cover'
                                                    />
                                                )}
                                                <div>
                                                    <p className='font-medium'>{item.contactInfo?.name || item.user?.username || 'N/A'}</p>
                                                    <p className='text-xs text-gray-500'>{item.contactInfo?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className='py-3 px-4 text-gray-700 max-lg:hidden'>
                                            <p className='font-medium'>{item.tour?.name || 'N/A'}</p>
                                            <p className='text-xs text-gray-500'>{item.tour?.location || ''}</p>
                                        </td>

                                        <td className='py-3 px-4 text-gray-700 text-center max-md:hidden'>
                                            <p className='font-medium'>
                                                {new Date(item.bookingDate).toLocaleDateString('vi-VN', { 
                                                    day: '2-digit', 
                                                    month: '2-digit' 
                                                })}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(item.bookingDate).getFullYear()}
                                            </p>
                                        </td>

                                        <td className='py-3 px-4 text-center max-sm:hidden'>
                                            <span className='inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium'>
                                                <span>👥</span>
                                                {item.numberOfGuests || 0}
                                            </span>
                                        </td>

                                        <td className='py-3 px-4 text-gray-700 text-center'>
                                            <p className='font-semibold'>{(item.totalPrice || 0).toLocaleString('vi-VN')}</p>
                                            <p className='text-xs text-gray-500'>{currency}</p>
                                        </td>

                                        <td className='py-3 px-4'>
                                            <div className='flex flex-col items-center gap-2'>
                                                <button 
                                                    onClick={() => handleTogglePayment(item._id, item.isPaid)}
                                                    disabled={updating}
                                                    className={`py-1.5 px-4 text-xs rounded-full font-medium transition-all ${
                                                        item.isPaid 
                                                            ? 'bg-green-500 text-white hover:bg-green-600' 
                                                            : 'bg-yellow-300 text-gray-800 hover:bg-yellow-400'
                                                    } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    {item.isPaid ? '✓ Đã TT' : '⏳ Chờ TT'}
                                                </button>

                                                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                                    item.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                    item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.status === 'confirmed' ? 'Đã XN' :
                                                     item.status === 'cancelled' ? 'Đã hủy' :
                                                     item.status === 'completed' ? 'Hoàn thành' :
                                                     'Chờ XL'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className='py-3 px-4 text-center'>
                                            <button
                                                onClick={() => handleViewContact(item)}
                                                className='px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                            >
                                                👁️ Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Contact Info Modal */}
            {showContactModal && selectedBooking && (
                <div 
                    className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
                    onClick={() => setShowContactModal(false)}
                >
                    <div 
                        className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-xl'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-xl font-semibold'>Thông tin chi tiết Booking</h3>
                                <button 
                                    onClick={() => setShowContactModal(false)}
                                    className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className='p-6 space-y-6'>
                            {/* User Info */}
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <span className='text-blue-500'>👤</span>
                                    Thông tin người đặt
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Họ tên</label>
                                        <p className='font-medium text-gray-800'>
                                            {selectedBooking.contactInfo?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Email</label>
                                        <p className='font-medium text-gray-800 break-all'>
                                            {selectedBooking.contactInfo?.email || selectedBooking.user?.email || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Số điện thoại</label>
                                        <p className='font-medium text-gray-800'>
                                            {selectedBooking.contactInfo?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>CCCD/CMND</label>
                                        <p className='font-medium text-gray-800'>
                                            {selectedBooking.contactInfo?.cccd || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                {selectedBooking.contactInfo?.notes && (
                                    <div className='mt-3'>
                                        <label className='text-gray-500 text-xs'>Ghi chú</label>
                                        <p className='text-sm text-gray-700 bg-white p-3 rounded border'>
                                            {selectedBooking.contactInfo.notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Tour Info */}
                            <div className='bg-blue-50 rounded-lg p-4'>
                                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <span className='text-blue-500'>🗺️</span>
                                    Thông tin tour
                                </h4>
                                <div className='flex gap-4'>
                                    {selectedBooking.tour?.images?.[0] && (
                                        <img 
                                            src={selectedBooking.tour.images[0]} 
                                            alt="tour" 
                                            className='w-24 h-24 rounded-lg object-cover'
                                        />
                                    )}
                                    <div className='flex-1'>
                                        <p className='font-semibold text-gray-800 text-lg'>
                                            {selectedBooking.tour?.name || 'N/A'}
                                        </p>
                                        <p className='text-sm text-gray-600 flex items-center gap-1 mt-1'>
                                            <span>📍</span>
                                            {selectedBooking.tour?.location || 'N/A'}
                                        </p>
                                        <p className='text-sm text-gray-600 mt-1'>
                                            ⏱️ {selectedBooking.tour?.time || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className='bg-green-50 rounded-lg p-4'>
                                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <span className='text-green-500'>📋</span>
                                    Chi tiết đặt tour
                                </h4>
                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Ngày khởi hành</label>
                                        <p className='font-medium text-gray-800'>
                                            {new Date(selectedBooking.bookingDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Số khách</label>
                                        <p className='font-medium text-gray-800'>
                                            {selectedBooking.numberOfGuests || 0} người
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Tổng tiền</label>
                                        <p className='font-bold text-green-600 text-lg'>
                                            {(selectedBooking.totalPrice || 0).toLocaleString('vi-VN')} {currency}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs'>Ngày đặt</label>
                                        <p className='font-medium text-gray-800'>
                                            {new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                                    <span className='text-blue-500'>📊</span>
                                    Trạng thái
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='text-gray-500 text-xs block mb-2'>Thanh toán</label>
                                        <span className={`inline-block px-4 py-2 rounded-full font-medium ${
                                            selectedBooking.isPaid 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-yellow-300 text-gray-800'
                                        }`}>
                                            {selectedBooking.isPaid ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className='text-gray-500 text-xs block mb-2'>Trạng thái booking</label>
                                        <select
                                            value={selectedBooking.status}
                                            onChange={(e) => handleChangeStatus(selectedBooking._id, e.target.value)}
                                            disabled={updating}
                                            className='w-full px-3 py-2 border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                                        >
                                            <option value='pending'>Chờ xử lý</option>
                                            <option value='confirmed'>Đã xác nhận</option>
                                            <option value='completed'>Hoàn thành</option>
                                            <option value='cancelled'>Đã hủy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3'>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
