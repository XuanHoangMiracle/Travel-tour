import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets, cities } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddTour = () => {
    const { axios, getToken } = useAppContext();

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null
    })
    
    const [inputs, setInputs] = useState({
        name: '',
        location: '',
        guest: 1,
        price: '',
        time: '',
        schedule: '',
        amenties: {
            'free Wifi': false,
            'Máy bay': false,
            'Bữa sáng': false,
            'Leo núi': false,
            'Oto': false,
        }
    })

    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!inputs.name || !inputs.location || !inputs.guest || !inputs.price || 
            !inputs.time || !inputs.schedule || !Object.values(images).some(image => image)) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', inputs.name);
            formData.append('location', inputs.location);
            formData.append('guest', inputs.guest);
            formData.append('price', inputs.price);
            formData.append('time', inputs.time);
            formData.append('schedule', inputs.schedule);
            
            const amenties = Object.keys(inputs.amenties).filter(key => inputs.amenties[key]);
            amenties.forEach(service => {
                formData.append('service', service);
            });

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key]);
            })

            const { data } = await axios.post('/api/tours', formData, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            
            if (data.success) {
                toast.success(data.message);
                setInputs({
                    name: '',
                    location: '',
                    guest: 1,
                    price: '',
                    time: '',
                    schedule: '',
                    amenties: {
                        'free Wifi': false,
                        'Máy bay': false,
                        'Bữa sáng': false,
                        'Leo núi': false,
                        'Oto': false,
                    }
                })
                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null
                })
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="max-h-screen overflow-y-auto p-4">
            <Title align='left' font='outfit' title='Thêm tour mới' 
                subTitle='Thêm tour mới vào danh sách tour của Travel Tours' />
            
            {/* Container chính với grid 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                
                {/* Cột trái */}
                <div className="space-y-4">
                    {/* Tên tour */}
                    <div>
                        <p className='text-gray-800 text-sm'>Tên tour</p>
                        <input
                            type='text'
                            placeholder='Du lịch Hội An 3N2Đ'
                            className='border border-gray-300 mt-1 rounded p-2 w-full text-sm'
                            value={inputs.name}
                            onChange={e => setInputs(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    {/* 4 trường nằm ngang: Vị trí, Số khách, Giá, Thời gian */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Vị trí */}
                        <div>
                            <p className='text-gray-800 text-sm'>Vị trí</p>
                            <select
                                value={inputs.location}
                                onChange={e => setInputs(prev => ({ ...prev, location: e.target.value }))}
                                className='border border-gray-300 mt-1 rounded p-2 w-full text-sm'
                                required
                            >
                                <option value=''>Chọn</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Số khách */}
                        <div>
                            <p className='text-gray-800 text-sm'>Số khách</p>
                            <input
                                min={1}
                                type="number"
                                placeholder='10'
                                className='border border-gray-300 mt-1 rounded p-2 w-full text-sm'
                                value={inputs.guest}
                                onChange={e => setInputs(prev => ({ ...prev, guest: Number(e.target.value) }))}
                                required
                            />
                        </div>

                        {/* Giá */}
                         <div>
                            <p className='text-gray-800 text-sm'>Giá (VNĐ)</p>
                            <input
                                min={1}
                                type="number"
                                placeholder='5000000'
                                className='border border-gray-300 mt-1 rounded p-2 w-full text-sm'
                                value={inputs.price}
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === '' || Number(value) >= 0) {
                                        setInputs(prev => ({ ...prev, price: value }))
                                    }
                                }}
                                required
                            />
                        </div>

                        {/* Thời gian */}
                        <div>
                            <p className='text-gray-800 text-sm'>Thời gian</p>
                            <input
                                type='text'
                                placeholder='3N2Đ'
                                className='border border-gray-300 mt-1 rounded p-2 w-full text-sm'
                                value={inputs.time}
                                onChange={e => setInputs(prev => ({ ...prev, time: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    {/* Lịch trình*/}
                    <div>
                        <p className='text-gray-800 text-sm'>Lịch trình</p>
                        <textarea
                            rows={3}
                            placeholder='Ngày 1: Đón khách...'
                            className='border border-gray-300 mt-1 rounded min-h-32 p-2 w-full text-sm'
                            value={inputs.schedule}
                            onChange={e => setInputs(prev => ({ ...prev, schedule: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Dịch vụ - compact */}
                    <div>
                        <p className='text-gray-800 text-sm'>Dịch vụ</p>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2'>
                            {Object.keys(inputs.amenties).map((amenity, index) => (
                                <label
                                    key={index}
                                    htmlFor={`amenities${index + 1}`}
                                    className='flex items-center space-x-2 text-sm cursor-pointer'
                                >
                                    <input
                                        type='checkbox'
                                        id={`amenities${index + 1}`}
                                        className='h-4 w-4 rounded border-gray-300 text-blue-600'
                                        checked={inputs.amenties[amenity]}
                                        onChange={() =>
                                            setInputs({
                                                ...inputs,
                                                amenties: { ...inputs.amenties, [amenity]: !inputs.amenties[amenity] }
                                            })
                                        }
                                    />
                                    <span className='text-gray-700'>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải - Ảnh */}
                <div>
                    <p className='text-gray-800 text-sm'>Ảnh tour</p>
                    <div className='grid grid-cols-2 gap-3 mt-2'>
                        {Object.keys(images).map((key) => (
                            <label htmlFor={`tourImages${key}`} key={key} className="cursor-pointer">
                                <img 
                                    className='w-full h-32 object-cover rounded border-2 border-dashed border-gray-300 hover:border-blue-400 transition'
                                    src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
                                    alt="" 
                                />
                                <input 
                                    type='file' 
                                    accept='image/*' 
                                    id={`tourImages${key}`} 
                                    hidden
                                    onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })} 
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nút submit */}
            <button 
                type="submit"
                className='bg-primary text-white px-8 py-2.5 rounded mt-6 cursor-pointer hover:opacity-90 transition disabled:opacity-50' 
                disabled={loading}
            >
                {loading ? 'Đang thêm...' : "Thêm tour"}
            </button>
        </form>
    )
}

export default AddTour;
