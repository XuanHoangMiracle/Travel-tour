import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {
    const { axios, getToken, currency, user } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(null);
    
    // Transaction History states
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);

    // Helper function: Lấy chữ đầu của tên tour
    const getTourNamePreview = (name, maxLength = 30) => {
        if (!name) return 'N/A';
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

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

    const fetchTransactions = async () => {
        if (transactions.length > 0) return;
        
        setTransactionsLoading(true);
        try {
            const { data } = await axios.get('/api/bookings/my-transactions', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            console.log('Transactions data:', data);

            if (data.success) {
                setTransactions(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('fetchTransactions error:', error);
            toast.error('Lỗi tải lịch sử giao dịch');
        } finally {
            setTransactionsLoading(false);
        }
    };

    const toggleTransactions = () => {
        if (!showTransactions && transactions.length === 0) {
            fetchTransactions();
        }
        setShowTransactions(!showTransactions);
    };

    const handlePayment = async (bookingId) => {
        setPaymentLoading(bookingId);
        try {
            const { data } = await axios.post(
                '/api/bookings/create-payment',
                { bookingId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                window.location.href = data.paymentUrl;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('handlePayment error:', error);
            toast.error(error.response?.data?.message || 'Lỗi tạo thanh toán');
        } finally {
            setPaymentLoading(null);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Bạn có chắc muốn hủy booking này?')) return;

        try {
            const { data } = await axios.put(
                `/api/bookings/${bookingId}/cancel`, 
                {},
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchBookings();
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
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                <p className='text-gray-500 mt-4'>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title 
                title='Tours của tôi' 
                subTitle='Dễ dàng quản lý các tour của bạn, lên kế hoạch cho chuyến đi sắp tới'
                align='left'
            />
            
            {/* Transaction History Toggle Button */}
            <div className='flex justify-end mb-4'>
                <button
                    onClick={toggleTransactions}
                    className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 
                        text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all 
                        shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'
                >
                    <span className='font-medium'>Lịch sử giao dịch</span>
                    <svg 
                        className={`w-4 h-4 transition-transform ${showTransactions ? 'rotate-180' : ''}`} 
                        fill='none' 
                        stroke='currentColor' 
                        viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                </button>
            </div>

            {/*     Transaction History Section - SỬ DỤNG getTourNamePreview() */}
            {showTransactions && (
                <div className='mb-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideDown'>
                    <div className='bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4'>
                        <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                            Lịch sử giao dịch
                        </h2>
                    </div>

                    <div className='p-6'>
                        {transactionsLoading ? (
                            <div className='text-center py-8'>
                                <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
                                <p className='text-gray-500 mt-2'>Đang tải...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className='text-center py-8'>
                                <div className='text-4xl mb-2'>📭</div>
                                <p className='text-gray-500'>Chưa có giao dịch nào</p>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-gray-50 border-b-2 border-gray-200'>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Tên Tour
                                            </th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Mã GD
                                            </th>
                                            <th className='px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Số tiền
                                            </th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Phương thức
                                            </th>
                                            <th className='px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Trạng thái
                                            </th>
                                            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>
                                                Thời gian
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200 bg-white'>
                                        {transactions.map((transaction, index) => (
                                            <tr 
                                                key={transaction.transaction_id || index} 
                                                className='hover:bg-purple-50 transition-colors'
                                            >
                                                {/* TÊN TOUR - TRUNCATED */}
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center gap-3 max-w-xs'>
                                                        {transaction.tour?.images?.[0] && (
                                                            <img 
                                                                src={transaction.tour.images[0]} 
                                                                alt='tour'
                                                                className='w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0'
                                                            />
                                                        )}
                                                        <div className='flex-1 min-w-0'>
                                                            <p 
                                                                className='text-sm font-medium text-gray-900'
                                                                title={transaction.tour?.name || 'N/A'}
                                                            >
                                                                {getTourNamePreview(transaction.tour?.name, 35)}
                                                            </p>
                                                            {transaction.tour?.location && (
                                                                <p className='text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate'>
                                                                    <span className='truncate'>{transaction.tour.location}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* MÃ GIAO DỊCH */}
                                                <td className='px-4 py-4'>
                                                    <div className='flex flex-col gap-1'>
                                                        <span className='font-mono text-xs text-gray-900 font-medium'>
                                                            {transaction.vnp_txn_ref?.slice(-8).toUpperCase() || 'N/A'}
                                                        </span>
                                                        {transaction.vnp_transaction_no && (
                                                            <span className='font-mono text-xs text-gray-400'>
                                                                GD: {transaction.vnp_transaction_no}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* SỐ TIỀN */}
                                                <td className='px-4 py-4 text-right'>
                                                    <div className='flex flex-col items-end'>
                                                        <span className='text-base font-bold text-gray-900'>
                                                            {transaction.amount?.toLocaleString('vi-VN')}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>{currency}</span>
                                                    </div>
                                                </td>

                                                {/* PHƯƠNG THỨC THANH TOÁN */}
                                                <td className='px-4 py-4'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0'>
                                                            <span className='text-sm'>💳</span>
                                                        </div>
                                                        <div className='flex flex-col min-w-0'>
                                                            <span className='text-sm font-medium text-gray-900 truncate'>
                                                                {transaction.vnp_bank_code || 'VNPay'}
                                                            </span>
                                                            <span className='text-xs text-gray-500 truncate'>
                                                                {transaction.vnp_card_type || 'Online'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* TRẠNG THÁI */}
                                                <td className='px-4 py-4 text-center'>
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                        transaction.status === 'success' 
                                                            ? 'bg-green-100 text-green-700 border border-green-200' 
                                                            : transaction.status === 'failed'
                                                            ? 'bg-red-100 text-red-700 border border-red-200'
                                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                        {transaction.status === 'success' ? (
                                                            <>
                                                                <span>✓</span>
                                                                <span>Thành công</span>
                                                            </>
                                                        ) : transaction.status === 'failed' ? (
                                                            <>
                                                                <span>✗</span>
                                                                <span>Thất bại</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>⏳</span>
                                                                <span>Đang xử lý</span>
                                                            </>
                                                        )}
                                                    </span>
                                                    {transaction.vnp_response_code && transaction.vnp_response_code !== '00' && (
                                                        <p className='text-xs text-gray-400 mt-1'>
                                                            Mã: {transaction.vnp_response_code}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* THỜI GIAN */}
                                                <td className='px-4 py-4'>
                                                    <div className='flex flex-col gap-1 whitespace-nowrap'>
                                                        <span className='text-sm font-medium text-gray-900'>
                                                            {new Date(transaction.created_at).toLocaleDateString('vi-VN', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {new Date(transaction.created_at).toLocaleTimeString('vi-VN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bookings List - GIỮ NGUYÊN */}
            <div className='max-w-6xl w-full text-gray-800'>
                <div className="hidden md:grid md:grid-cols-[4fr_3fr_2fr_1fr] w-full border-b border-gray-300
                    font-medium text-base py-3 items-center gap-4 whitespace-nowrap">
                    <div className="overflow-hidden text-ellipsis ml-15">Tour</div>
                    <div className="overflow-hidden text-ellipsis ml-15">Ngày khởi hành</div>
                    <div className="overflow-hidden text-ellipsis">Số khách</div>
                    <div className="overflow-hidden text-ellipsis">Trạng thái</div>
                </div>

                {bookings.length === 0 ? (
                    <div className='py-16 text-center'>
                        <div className='text-6xl mb-4'>📋</div>
                        <p className='text-gray-500 text-lg mb-4'>Bạn chưa có booking nào</p>
                        <button 
                            onClick={() => window.location.href = '/tours'}
                            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                        >
                            Khám phá tour
                        </button>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div 
                            key={booking._id} 
                            className='grid grid-cols-1 md:grid-cols-[4fr_3fr_2fr_1fr] 
                            border-b border-gray-300 py-6 first:border-t hover:bg-gray-50 transition-colors'
                        >
                            <div className='flex flex-col md:flex-row'>
                                <img 
                                    src={booking.tour?.images?.[0] || assets.uploadArea} 
                                    alt="tour" 
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

                                    <p className='text-base font-semibold text-blue-600'>
                                        {booking.totalPrice?.toLocaleString('vi-VN')} {currency}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center md:ml-15 max-md:mt-4'>
                                <p className='text-gray-700 font-medium'>
                                    {new Date(booking.bookingDate).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>
                                    Đặt: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>

                            <div className='flex items-center md:justify-center max-md:mt-2'>
                                <div className='flex items-center gap-1 text-sm text-gray-600'>  
                                    <img src={assets.guestsIcon} alt="" className='h-4 w-4' />
                                    <span>{booking.numberOfGuests} khách</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-center justify-center gap-2 max-md:mt-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    booking.isPaid 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {booking.isPaid ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
                                </span>

                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                     booking.status === 'cancelled' ? 'Đã hủy' :
                                     booking.status === 'completed' ? 'Hoàn thành' :
                                     'Chờ xử lý'}
                                </span>

                                {!booking.isPaid && booking.status !== 'cancelled' && (
                                    <div className='flex flex-col gap-2 w-full'>
                                        <button 
                                            onClick={() => handlePayment(booking._id)}
                                            disabled={paymentLoading === booking._id}
                                            className={`px-4 py-1.5 text-xs bg-blue-500 text-white rounded-full
                                                hover:bg-blue-600 transition-all whitespace-nowrap
                                                ${paymentLoading === booking._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {paymentLoading === booking._id ? 'Đang xử lý...' : '💳 Thanh toán ngay'}
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(booking._id)}
                                            className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full
                                                hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap">
                                            Hủy booking
                                        </button>
                                    </div>
                                )}

                                {booking.isPaid && booking.status === 'confirmed' && (
                                    <p className='text-xs text-green-600 text-center'>
                                        ✓ Booking đã được xác nhận
                                    </p>
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
