import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookingId = searchParams.get('bookingId');
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    // Error code mapping
    const getErrorIcon = (code) => {
        if (code === '24') return '🚫'; 
        if (code === '51') return '💳'; 
        if (code === '07') return '⚠️'; 
        return '❌'; // Default
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4'>
            <div className='max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn'>
                <div className='text-center'>
                    {/* Error Icon */}
                    <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-shake'>
                        <span className='text-5xl'>{getErrorIcon(code)}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className='text-3xl font-bold text-gray-800 mb-3'>
                        Thanh toán thất bại
                    </h2>
                    
                    {/* Error Message */}
                    <div className='bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6'>
                        <p className='text-red-800 font-medium mb-2'>
                            {decodeURIComponent(message || 'Giao dịch không thành công')}
                        </p>
                        {code && (
                            <p className='text-xs text-red-600 font-mono'>
                                Mã lỗi: {code}
                            </p>
                        )}
                    </div>

                    {/* Booking ID */}
                    {bookingId && (
                        <div className='bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200'>
                            <p className='text-xs text-gray-500 mb-1'>Mã booking</p>
                            <p className='text-sm font-mono font-semibold text-gray-700 break-all'>
                                {bookingId}
                            </p>
                        </div>
                    )}

                    {/* Help Info */}
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                        <p className='text-sm text-blue-800'>
                            💬 Cần hỗ trợ? Liên hệ: <strong>support@traveltour.vn</strong>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-3'>
                        <button
                            onClick={() => navigate('/mybookings')}
                            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                                rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold
                                shadow-lg hover:shadow-xl transform hover:scale-105'
                        >
                            Về trang Bookings
                        </button>
                        
                        <button
                            onClick={() => navigate('/')}
                            className='px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                                hover:bg-gray-50 transition-all font-medium'
                        >
                            🏠 Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
