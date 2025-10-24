import React, { useState, useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListTour = () => {
    const [tours, setTours] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [showDetailModal, setShowDetailModal] = useState(null)
    const { axios, getToken } = useAppContext()

    // fetch
    const fetchTours = async () => {
        try {
            const { data } = await axios.get('/api/tours', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setTours(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Không thể tải danh sách tour')
        }
    }

    useEffect(() => {
        fetchTours()
    }, [])

    //edit tour
    const handleEdit = (tour) => {
        setEditingId(tour._id)
        setEditForm({
            name: tour.name,
            location: tour.location,
            guest: tour.guest,
            price: tour.price,
            time: tour.time,       
            schedule: tour.schedule,  
        })
    }

    // cancel edit
    const handleCancel = () => {
        setEditingId(null)
        setEditForm({})
    }

    // save edit
    const handleSave = async (tourId) => {
        try {
            const { data } = await axios.put(`/api/tours/${tourId}`, editForm, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            
            if (data.success) {
                toast.success('Cập nhật tour thành công!')
                setTours(tours.map(t => t._id === tourId ? { ...t, ...editForm } : t))
                setEditingId(null)
                setEditForm({})
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message || 'Không thể cập nhật tour')
        }
    }

    return (
        <div>
            <Title 
                align='left' 
                font='outfit' 
                title='Danh sách tour' 
                subTitle='Xem, sửa, xóa danh sách tour của bạn - dễ dàng quản lý tất cả'
            />
            
            <p className='text-gray-500 mt-8'>Tất cả tour ({tours.length})</p>
            
            <div className='w-full text-left border border-gray-300 rounded-lg max-h-[450px] overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50 sticky top-0'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left'>Tên tour</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left max-lg:hidden'>Vị trí</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left max-xl:hidden'>Thời gian</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left max-md:hidden'>Khách</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-left'>Giá (VNĐ)</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm'>
                        {tours.length === 0 ? (
                            <tr>
                                <td colSpan="6" className='py-8 text-center text-gray-500'>
                                    Chưa có tour nào
                                </td>
                            </tr>
                        ) : (
                            tours.map((tour) => (
                                <tr key={tour._id} className='hover:bg-gray-50'>
                                    {editingId === tour._id ? (
                                        // ✅ Chế độ chỉnh sửa
                                        <>
                                            <td className='py-3 px-4 border-t border-gray-300'>
                                                <input
                                                    type='text'
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className='border rounded p-1 w-full text-sm'
                                                />
                                            </td>
                                            <td className='py-3 px-4 border-t border-gray-300 max-lg:hidden'>
                                                <input
                                                    type='text'
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    className='border rounded p-1 w-full text-sm'
                                                />
                                            </td>
                                            {/* ✅ Edit Thời gian */}
                                            <td className='py-3 px-4 border-t border-gray-300 max-xl:hidden'>
                                                <input
                                                    type='text'
                                                    value={editForm.time}
                                                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                                    placeholder='3N2Đ'
                                                    className='border rounded p-1 w-20 text-sm'
                                                />
                                            </td>
                                            <td className='py-3 px-4 border-t border-gray-300 max-md:hidden'>
                                                <input
                                                    type='number'
                                                    value={editForm.guest}
                                                    onChange={(e) => setEditForm({ ...editForm, guest: Number(e.target.value) })}
                                                    className='border rounded p-1 w-16 text-sm'
                                                />
                                            </td>
                                            <td className='py-3 px-4 border-t border-gray-300'>
                                                <input
                                                    type='number'
                                                    value={editForm.price}
                                                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                                    className='border rounded p-1 w-28 text-sm'
                                                />
                                            </td>
                                            <td className='py-3 px-4 border-t border-gray-300'>
                                                <div className='flex flex-col gap-2'>
                                                    {/* ✅ Nút chỉnh sửa lịch trình */}
                                                    <button
                                                        onClick={() => setShowDetailModal(tour._id)}
                                                        className='bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600'
                                                    >
                                                        Lịch trình
                                                    </button>
                                                    <div className='flex gap-2'>
                                                        <button
                                                            onClick={() => handleSave(tour._id)}
                                                            className='bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600'
                                                        >
                                                            Lưu
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className='bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500'
                                                        >
                                                            Hủy
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // ✅ Chế độ xem
                                        <>
                                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                                {tour.name}
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-lg:hidden'>
                                                {tour.location}
                                            </td>
                                            {/* ✅ Hiển thị Thời gian */}
                                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-xl:hidden'>
                                                {tour.time}
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-md:hidden'>
                                                {tour.guest} người
                                            </td>
                                            <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                                {tour.price?.toLocaleString('vi-VN')} VNĐ
                                            </td>
                                            <td className='py-3 px-4 border-t border-gray-300'>
                                                <div className='flex flex-col gap-2 items-center'>
                                                    {/* ✅ Xem lịch trình */}
                                                    <button
                                                        onClick={() => setShowDetailModal(tour._id)}
                                                        className='text-blue-600 text-xs underline hover:text-blue-800'
                                                    >
                                                        Xem chi tiết lịch trình
                                                    </button>
                                                    {/* Icon Edit */}
                                                    <img 
                                                        src="/setting.png" 
                                                        alt="Edit" 
                                                        onClick={() => handleEdit(tour)}
                                                        className='h-5 cursor-pointer hover:opacity-70 transition'
                                                    />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal chi tiết lịch trình */}
            {showDetailModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto'>
                        <div className='sticky top-0 bg-white border-b p-4 flex justify-between items-center'>
                            <h2 className='text-xl font-bold'>Chi tiết lịch trình</h2>
                            <button 
                                onClick={() => setShowDetailModal(null)}
                                className='text-gray-500 hover:text-gray-700 text-2xl'
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className='p-6'>
                            {editingId === showDetailModal ? (
                                // ✅ Edit mode trong modal
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Lịch trình chi tiết
                                    </label>
                                    <textarea
                                        rows={12}
                                        value={editForm.schedule}
                                        onChange={(e) => setEditForm({ ...editForm, schedule: e.target.value })}
                                        className='border border-gray-300 rounded p-3 w-full text-sm resize-y'
                                        placeholder='Ngày 1: Đón khách...'
                                    />
                                </div>
                            ) : (
                                // ✅ View mode
                                <div>
                                    <h3 className='font-semibold text-gray-800 mb-2'>Lịch trình</h3>
                                    <p className='text-gray-700 whitespace-pre-wrap'>
                                        {tours.find(t => t._id === showDetailModal)?.schedule}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListTour
