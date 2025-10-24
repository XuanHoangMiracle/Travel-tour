import React, { useState } from 'react'
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Hero = () => {
    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");
    const [open, setOpen] = useState(false);

    // Lọc cities theo input
    const filtered = React.useMemo(() => {
        const q = destination.trim().toLowerCase();
        return q ? cities.filter(c => c.toLowerCase().includes(q)) : cities;
    }, [destination]);

    // Xử lý submit form tìm kiếm
    const onSearch = async (e) => {
        e.preventDefault();
        
        if (!destination.trim()) {
            return;
        }

        // Navigate đến trang tours với query destination
        navigate(`/tours?destination=${encodeURIComponent(destination)}`);

        // Lưu thành phố tìm kiếm vào state
        setSearchedCities((prev) => {
            const updatedSearchedCities = [destination, ...prev.filter(city => city !== destination)];
            if (updatedSearchedCities.length > 3) {
                updatedSearchedCities.pop(); // Xóa phần tử cuối nếu > 3
            }
            return updatedSearchedCities;
        });

        //  Call API lưu searched cities (nếu user đã login)
        try {
            const token = await getToken();
            if (token) {
                await axios.post('/api/user/searched-cities', {
                    recentSearchedCities: destination
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Error saving searched city:', error);
            // Không hiển thị lỗi cho user vì đây là feature phụ
        }
    };

    return (
        <div className='flex flex-col items-start justify-center px-6
        md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/HeroImage.png")] 
        bg-no-repeat bg-cover bg-center h-screen'> 
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Trải nghiệm du lịch tuyệt vời</p>
            <h1 className='font-playfair text-2xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
                Điểm Đến Hoàn Hảo Dành Cho Bạn
            </h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>
                Khám phá những địa điểm du lịch tuyệt đẹp và trải nghiệm những dịch vụ tốt nhất cùng chúng tôi.
            </p>

            <form onSubmit={onSearch}
                className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

                {/* Destination Input với Dropdown */}
                <div className="relative">
                    <div className='flex items-center gap-2'>
                        <img src={assets.location} alt="" className='h-4'/>
                        <label htmlFor="destinationInput">Chọn điểm đến</label>
                    </div>

                    <input
                        onChange={e => setDestination(e.target.value)} 
                        value={destination} 
                        id="destinationInput"
                        type="text"
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-64 md:w-45"
                        placeholder="Điểm đến của bạn"
                        required
                        autoComplete="off"
                        onFocus={() => setOpen(true)}
                        onBlur={() => setTimeout(() => setOpen(false), 150)}
                    />

                    {/* Dropdown gợi ý */}
                    {open && filtered.length > 0 && (
                        <ul
                            role="listbox"
                            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-44 overflow-y-auto"
                        >
                            {filtered.map((city, idx) => (
                                <li
                                    key={city + idx}
                                    role="option"
                                    className="px-3 py-2 cursor-pointer select-none hover:bg-blue-50 text-gray-700"
                                    onMouseDown={() => { 
                                        setDestination(city); 
                                        setOpen(false); 
                                    }}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Ngày khởi hành */}
                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4'/>
                        <label htmlFor="checkIn">Ngày khởi hành</label>
                    </div>
                    <input 
                        id="checkIn" 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" 
                    />
                </div>

                {/* Số ngày */}
                <div>
                    <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                        <label htmlFor="days">Số Ngày</label>
                        <input 
                            min={1} 
                            max={30} 
                            id="days" 
                            type="number" 
                            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" 
                            placeholder="1"  
                            defaultValue={1}   
                        />
                    </div>
                </div>

                {/* Số khách */}
                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Số khách</label>
                    <input 
                        min={1} 
                        max={20} 
                        id="guests" 
                        type="number" 
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" 
                        placeholder="1"  
                        defaultValue={1}   
                    />
                </div>

                {/* Button tìm kiếm */}
                <button 
                    type="submit"
                    className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer hover:bg-gray-800 transition-colors max-md:w-full max-md:py-1'
                >
                    <img src={assets.searchIcon} alt="searchIcon" className='h-7'/>
                    <span>Tìm kiếm</span>
                </button>
            </form>
        </div>
    )
}

export default Hero
