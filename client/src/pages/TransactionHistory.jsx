import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Title from '../components/Title';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
    const { axios, getToken, currency, user } = useAppContext();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const { data } = await axios.get('/api/bookings/my-transactions', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setTransactions(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('fetchTransactions error:', error);
            toast.error('Lỗi tải lịch sử giao dịch');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const getStatusBadge = (status) => {
        const badges = {
            success: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
            pending: 'bg-yellow-100 text-yellow-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            success: 'Thành công',
            failed: 'Thất bại',
            pending: 'Đang xử lý'
        };
        return texts[status] || status;
    };

    if (loading) {
        return (
            <div className='py-28 text-center'>
                <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                <p className='text-gray-500 mt-4'>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title 
                title='Lịch sử giao dịch' 
                subTitle='Xem chi tiết các giao dịch thanh toán của bạn'
                align='left'
            />

            <div className='mt-8 max-w-5xl'>
                {transactions.length === 0 ? (
                    <div className='text-center py-16 bg-gray-50 rounded-xl'>
                        <div className='text-6xl mb-4'>💳</div>
                        <p className='text-gray-500 text-lg'>Chưa có giao dịch nào</p>
                    </div>
                ) : (
                    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase'>
                                            Mã GD
                                        </th>
                                        <th className='py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase'>
                                            Booking ID
                                        </th>
                                        <th className='py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase'>
                                            Số tiền
                                        </th>
                                        <th className='py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase'>
                                            Ngân hàng
                                        </th>
                                        <th className='py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase'>
                                            Ngày GD
                                        </th>
                                        <th className='py-3 px-4 text-center text-xs font-medium text-gray-600 uppercase'>
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className='hover:bg-gray-50 transition-colors'>
                                            <td className='py-4 px-4'>
                                                <p className='text-sm font-mono text-gray-900'>
                                                    {tx.vnp_txn_ref}
                                                </p>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <p className='text-sm text-gray-700'>
                                                    {tx.booking_id}
                                                </p>
                                            </td>
                                            <td className='py-4 px-4 text-center'>
                                                <p className='text-sm font-semibold text-gray-900'>
                                                    {tx.amount?.toLocaleString('vi-VN')}
                                                </p>
                                                <p className='text-xs text-gray-500'>{currency}</p>
                                            </td>
                                            <td className='py-4 px-4 text-center'>
                                                <p className='text-sm text-gray-700'>
                                                    {tx.vnp_bank_code || '-'}
                                                </p>
                                            </td>
                                            <td className='py-4 px-4 text-center'>
                                                <p className='text-sm text-gray-700'>
                                                    {new Date(tx.created_at).toLocaleDateString('vi-VN')}
                                                </p>
                                                <p className='text-xs text-gray-500'>
                                                    {new Date(tx.created_at).toLocaleTimeString('vi-VN')}
                                                </p>
                                            </td>
                                            <td className='py-4 px-4 text-center'>
                                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusBadge(tx.status)}`}>
                                                    {getStatusText(tx.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
