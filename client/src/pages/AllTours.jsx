import React, { useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';

const CheckBox = ({label, selected = false, onChange = () => {}}) => {
    return(
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type='checkbox' checked={selected} onChange={(e) => onChange(e.target.checked, label)}/>
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const RadioButton = ({label, selected = false, onChange = () => {}}) => {
    return(
        <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
            <input type='radio' name='sortOption' checked={selected} onChange={() => onChange(label)}/>
            <span className='font-light select-none'>{label}</span>
        </label>
    )
}

const AllTours = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { tours, navigate, currency } = useAppContext();

    const [openFilters, setOpenFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        guestQuantity: [],
        priceRanges: [],
    });
    const [selectedSort, setSelectedSort] = useState('');

    const guestQuantity = ['Tất cả', '1-5 khách', '5-10 khách', '10-20 khách', '20+ khách'];
    const priceRanges = [
        { label: '500.000 - 3.000.000 VNĐ', value: '500000-3000000' },
        { label: '3.000.000 - 5.000.000 VNĐ', value: '3000000-5000000' },
        { label: '5.000.000 - 10.000.000 VNĐ', value: '5000000-10000000' },
        { label: '10.000.000+ VNĐ', value: '10000000+' }
    ];
    const sortOptions = ['Giá: Từ thấp đến cao', 'Giá: Từ cao đến thấp', 'Mới nhất'];

    // Handle filter change
    const handleFilterChange = (checked, value, filterType) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (checked) {
                updatedFilters[filterType] = [...prevFilters[filterType], value];
            } else {
                updatedFilters[filterType] = prevFilters[filterType].filter((item) => item !== value);
            }
            return updatedFilters;
        });
    }

    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
    }

    // Filter theo khách
    const matchesQuantity = (tour) => {
        if (selectedFilters.guestQuantity.length === 0 || selectedFilters.guestQuantity.includes('Tất cả')) {
            return true;
        }
        
        return selectedFilters.guestQuantity.some(range => {
            if (range === '1-5 khách') return tour.guest >= 1 && tour.guest <= 5;
            if (range === '5-10 khách') return tour.guest > 5 && tour.guest <= 10;
            if (range === '10-20 khách') return tour.guest > 10 && tour.guest <= 20;
            if (range === '20+ khách') return tour.guest > 20;
            return false;
        });
    }

    // Filter theo giá
    const matchesPriceRange = (tour) => {
        if (selectedFilters.priceRanges.length === 0) return true;
        
        return selectedFilters.priceRanges.some(range => {
            if (range === '500000-3000000') return tour.price >= 500000 && tour.price <= 3000000;
            if (range === '3000000-5000000') return tour.price > 3000000 && tour.price <= 5000000;
            if (range === '5000000-10000000') return tour.price > 5000000 && tour.price <= 10000000;
            if (range === '10000000+') return tour.price > 10000000;
            return false;
        });
    }

    // Filter theo destination
    const filterDestinations = (tour) => {
        const destination = searchParams.get('destination');
        if (!destination) return true;
        return tour.location.toLowerCase().includes(destination.toLowerCase());
    }

    // Sort tours
    const sortTours = (a, b) => {
        if (selectedSort === 'Giá: Từ thấp đến cao') {
            return a.price - b.price;
        } else if (selectedSort === 'Giá: Từ cao đến thấp') {
            return b.price - a.price;
        } else if (selectedSort === 'Mới nhất') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    }

    // Filter và sort tours
    const filteredTours = useMemo(() => {
        return tours
            .filter(tour => matchesQuantity(tour) && matchesPriceRange(tour) && filterDestinations(tour))
            .sort(sortTours);
    }, [tours, selectedFilters, selectedSort, searchParams]);

    // Clear filters
    const clearFilters = () => {
        setSelectedFilters({
            guestQuantity: [],
            priceRanges: [],
        });
        setSelectedSort('');
        setSearchParams({});
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8'>
            {/* Tour List */}
            <div className='flex-1 w-full'>
                <div className='flex flex-col items-start text-left mb-8'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Tours du lịch</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                        Hãy tìm kiếm những tour du lịch mà bạn mong muốn.
                    </p>
                    <p className='text-sm text-gray-600 mt-2'>
                        Tìm thấy <span className='font-semibold'>{filteredTours.length}</span> tour
                    </p>
                </div>

                {filteredTours.length === 0 ? (
                    <div className='text-center py-20'>
                        <p className='text-gray-500 text-lg'>Không tìm thấy tour phù hợp</p>
                        <button 
                            onClick={clearFilters}
                            className='mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    filteredTours.map((tour) => (
                        <div key={tour._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-b-gray-300 last:pb-30 last:border-0'>
                            <img 
                                onClick={() => {navigate(`/tours/${tour._id}`); scrollTo(0,0)}}
                                src={tour.images?.[0] || assets.uploadArea} 
                                alt="tour-img" 
                                title='Chi tiết tour' 
                                className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer hover:scale-105 transition-transform'
                            />
                            <div className='md:w-1/2 flex flex-col gap-2'>
                                <p className='flex items-center gap-2 text-gray-500'>
                                    <img src={assets.locationIcon} alt="Location" className='h-4'/>
                                    {tour.location}
                                </p>
                                <p  
                                    onClick={() => {navigate(`/tours/${tour._id}`); scrollTo(0,0)}}
                                    className='text-gray-800 text-3xl font-playfair cursor-pointer hover:text-blue-600'
                                >
                                    {tour.name}
                                </p>
                                <div className='flex items-center gap-2'>
                                    <StarRating 
                                        rating={tour.averageRating || 5} 
                                        reviewCount={tour.reviewCount || 0}
                                    />
                                    <p className='text-sm text-gray-600'>
                                        ({tour.reviewCount || 0} đánh giá)
                                    </p>
                                </div>
                                {/* Tour info */}
                                <div className='flex flex-wrap items-center mt-3 mb-4 gap-3 text-sm text-gray-600'>
                                    <div className='flex items-center gap-1'>
                                        <span>⏱️</span>
                                        <span>{tour.time}</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <img src={assets.guestsIcon} alt="guests" className='h-4 w-4'/>
                                        <span>Tối đa {tour.guest} khách</span>
                                    </div>
                                </div>

                                {/* Tour price */}
                                <p className='text-2xl font-semibold text-blue-600 mt-4'>
                                    {tour.price?.toLocaleString('vi-VN')}
                                    <span className='text-sm font-normal ml-2 text-gray-500'>{currency}/người</span>
                                </p>

                                <button
                                    onClick={() => {navigate(`/tours/${tour._id}`); scrollTo(0,0)}}
                                    className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-fit'
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Filter Sidebar - sticky */}
            <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:sticky lg:top-24 lg:self-start'>
                <div className={`flex items-center justify-between px-5 py-2.5 border-b border-b-gray-300`}>
                    <p className='text-base font-medium text-gray-800'>Bộ Lọc</p>
                    <div className='text-xs cursor-pointer'>
                        <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden text-blue-500'>
                            {openFilters ? 'Ẩn' : 'Hiện'}
                        </span>
                        <span onClick={clearFilters} className='hidden lg:block text-blue-500 hover:underline'>
                            Xóa
                        </span>
                    </div>
                </div>

                <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    {/* Filter số khách */}
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Số lượng khách</p>
                        {guestQuantity.map((quantity, index) => (
                            <CheckBox 
                                key={index} 
                                label={quantity} 
                                selected={selectedFilters.guestQuantity.includes(quantity)} 
                                onChange={(checked) => handleFilterChange(checked, quantity, 'guestQuantity')}
                            />
                        ))}
                    </div>

                    {/* Filter giá - đã sửa */}
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Khoảng giá</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox 
                                key={index}
                                label={range.label} 
                                selected={selectedFilters.priceRanges.includes(range.value)} 
                                onChange={(checked) => handleFilterChange(checked, range.value, 'priceRanges')}
                            />
                        ))}
                    </div>

                    {/* Sort options */}
                    <div className='px-5 pt-5 pb-7'>
                        <p className='font-medium text-gray-800 pb-2'>Sắp xếp</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton 
                                key={index} 
                                label={option} 
                                selected={selectedSort === option} 
                                onChange={() => handleSortChange(option)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllTours
