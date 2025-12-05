import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { currency } = useAppContext();

    const bookingId = searchParams.get('bookingId');
    const amount = searchParams.get('amount');

    useEffect(() => {
        // Auto redirect sau 5 giây
        const timer = setTimeout(() => {
            navigate('/mybookings');
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn'>
                <div className='text-center'>
                    {/* Success Icon */}
                    <div className='w-18 h-18 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce'>
                        <svg className='w-14 h-14 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                        </svg>
                    </div>
                    
                    {/* Title */}
                    <h2 className='text-3xl font-bold text-gray-800 mb-3'>
                        ✅ Thanh toán thành công!
                    </h2>
                    
                    <p className='text-gray-600 mb-6 text-lg'>
                        Booking của bạn đã được xác nhận
                    </p>

                    {/* Amount Display */}
                    {amount && (
                        <div className='bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6'>
                            <p className='text-sm text-gray-600 mb-2'>Số tiền đã thanh toán</p>
                            <p className='text-4xl font-bold text-green-600'>
                                {parseFloat(amount).toLocaleString('vi-VN')} {currency}
                            </p>
                        </div>
                    )}

                    {/* Booking ID */}
                    {bookingId && (
                        <div className='bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200'>
                            <p className='text-xs text-gray-500 mb-1'>Mã booking</p>
                            <p className='text-sm font-mono font-semibold text-gray-700 break-all'>
                                {bookingId}
                            </p>
                        </div>
                    )}

                    {/* Success Message */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                        <p className='text-sm text-blue-800'>
                            📧 Email xác nhận sẽ được gửi đến hộp thư của bạn
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => navigate('/mybookings')}
                        className='w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white 
                            rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold 
                            shadow-lg hover:shadow-xl mb-4 transform hover:scale-105'
                    >
                        Xem booking của tôi
                    </button>

                    {/* Auto redirect info */}
                    <p className='text-sm text-gray-500'>
                        Tự động chuyển hướng sau 10 giây...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
