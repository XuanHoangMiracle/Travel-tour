import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import TourReviews from '../components/TourReviews';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const TourDetails = () => {
  const { id } = useParams();
  const { axios, getToken, user, currency, navigate } = useAppContext();
  
  const [tour, setTour] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [guestCount, setGuestCount] = useState(1);
  const [departureDate, setDepartureDate] = useState('');
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Contact info states
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    cccd: '',
    email: '',
    notes: ''
  });
  const [contactErrors, setContactErrors] = useState({});

  const fetchTourDetails = async () => {
    try {
      const { data } = await axios.get(`/api/tours/${id}`);
      if (data.success) {
        setTour(data.data);
        setMainImage(data.data.images?.[0]);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast.error('Không thể tải thông tin tour');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (selectedDate) => {
    setDepartureDate(selectedDate);
    setShowContactForm(false);
    
    if (!selectedDate) {
      setAvailabilityInfo(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const { data } = await axios.get('/api/bookings/availability/check', {
        params: { tourId: id, date: selectedDate }
      });

      console.log('Availability response:', data);

      if (data.success) {
        setAvailabilityInfo(data.data);
        
        if (data.data.availableSlots === 0) {
          toast.error('Ngày này đã hết chỗ. Vui lòng chọn ngày khác');
        } else if (data.data.status === 'limited') {
          toast(`Chỉ còn ${data.data.availableSlots} chỗ trống!`, {
            icon: '⚠️',
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error(error.response?.data?.message || 'Không thể kiểm tra tình trạng chỗ');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleGuestCountChange = (count) => {
    setGuestCount(count);
    
    if (availabilityInfo && count > availabilityInfo.availableSlots) {
      toast.error(`Chỉ còn ${availabilityInfo.availableSlots} chỗ trống cho ngày này`);
    }
  };

  const handleContactChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    if (contactErrors[field]) {
      setContactErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateContactInfo = () => {
    const errors = {};

    if (!contactInfo.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    } else if (contactInfo.name.trim().length < 3) {
      errors.name = 'Họ tên phải có ít nhất 3 ký tự';
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!contactInfo.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    const cccdRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    if (!contactInfo.cccd.trim()) {
      errors.cccd = 'Vui lòng nhập số CCCD';
    } else if (!cccdRegex.test(contactInfo.cccd.replace(/\s/g, ''))) {
      errors.cccd = 'CCCD phải là 9 hoặc 12 số';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactInfo.email && !emailRegex.test(contactInfo.email)) {
      errors.email = 'Email không hợp lệ';
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToContactForm = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt tour');
      navigate('/login');
      return;
    }

    if (!departureDate) {
      toast.error('Vui lòng chọn ngày khởi hành');
      return;
    }

    if (guestCount < 1) {
      toast.error('Số khách phải lớn hơn 0');
      return;
    }

    if (availabilityInfo && guestCount > availabilityInfo.availableSlots) {
      toast.error(`Chỉ còn ${availabilityInfo.availableSlots} chỗ trống`);
      return;
    }

    if (guestCount > tour.guest) {
      toast.error(`Số khách tối đa là ${tour.guest} người`);
      return;
    }

    setShowContactForm(true);
    
    setTimeout(() => {
      document.getElementById('contact-info-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!validateContactInfo()) {
      toast.error('Vui lòng điền đầy đủ thông tin liên hệ');
      return;
    }

    setBookingInProgress(true);

    try {
      const token = await getToken();
      
      const { data } = await axios.post(
        '/api/bookings/create',
        {
          tourId: id,
          numberOfGuests: guestCount,
          bookingDate: departureDate,
          contactInfo: {
            name: contactInfo.name,
            phone: contactInfo.phone,
            cccd: contactInfo.cccd,
            email: contactInfo.email || user?.primaryEmailAddress?.emailAddress || '',
            notes: contactInfo.notes
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success(
          <div>
            <p className='font-semibold'>Đặt tour thành công! 🎉</p>
            <p className='text-xs mt-1'>Mã booking: {data.data._id.slice(-8).toUpperCase()}</p>
          </div>,
          {
            duration: 5000,
            position: 'top-center',
          }
        );
        
        // Reset form
        setShowContactForm(false);
        setGuestCount(1);
        setDepartureDate('');
        setAvailabilityInfo(null);
        setContactInfo({
          name: '',
          phone: '',
          cccd: '',
          email: '',
          notes: ''
        });
        setContactErrors({});
        
        setTimeout(() => {
          document.getElementById('booking-form-section')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Đặt tour thất bại');
    } finally {
      setBookingInProgress(false);
    }
  };

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  if (loading) {
    return (
      <div className='py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
        <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        <p className='text-gray-500 mt-4'>Đang tải thông tin tour...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className='py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32 text-center'>
        <p className='text-gray-500 text-lg'>Không tìm thấy tour</p>
      </div>
    );
  }

  return (
    <div className='py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Tour header */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 mb-4'>
        <h1 className='text-3xl md:text-4xl font-playfair font-bold'>{tour.name}</h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>HOT DEAL</p>
      </div>

      <div className='flex items-center gap-1 mt-2'>
        <StarRating rating={tour.averageRating} reviewCount={tour.reviewCount} />
        <p className='ml-2 text-sm text-gray-600'>({tour.reviewCount} đánh giá)</p>
      </div>

      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" className='h-4 w-4'/>
        <span>{tour.location}</span>
      </div>

      {/* Images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full'>
          <img
            src={mainImage || tour.images?.[0] || assets.uploadArea}
            alt="Tour Main"
            className='w-full block rounded-xl shadow-lg object-cover aspect-[16/10]'
          />
        </div>

        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {tour.images && tour.images.length > 0 ? (
            <>
              {tour.images.slice(0, 4).map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt={`Tour ${index + 1}`}
                  className={`w-full block rounded-xl shadow-lg object-cover cursor-pointer aspect-[16/10] transition-all
                    ${mainImage === image 
                      ? 'outline-2 outline-orange-500 outline-offset-2 scale-105' 
                      : 'hover:scale-105 hover:shadow-xl'}`}
                />
              ))}
              {tour.images.length < 4 && 
                Array.from({ length: 4 - tour.images.length }).map((_, index) => (
                  <div key={`placeholder-${index}`} className='w-full aspect-[16/10] bg-gray-100 rounded-xl' />
                ))
              }
            </>
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`empty-${index}`} className='w-full aspect-[16/10] bg-gray-100 rounded-xl' />
            ))
          )}
        </div>
      </div>

      {/* Tour info grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
        {/* Left column - Tour details */}
        <div className='lg:col-span-2'>
          <h2 className='text-2xl font-playfair font-semibold mb-4'>Chi tiết tour</h2>
          
          <div className='flex flex-wrap items-center gap-4 mb-6'>
            <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50'>
              <span className='text-xl'>⏱️</span>
              <div>
                <p className='text-xs text-gray-600'>Thời gian</p>
                <p className='text-sm font-semibold'>{tour.time}</p>
              </div>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50'>
              <span className='text-xl'>👥</span>
              <div>
                <p className='text-xs text-gray-600'>Số khách</p>
                <p className='text-sm font-semibold'>Tối đa {tour.guest} người</p>
              </div>
            </div>
          </div>

          {tour.service?.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-lg font-semibold mb-3'>Dịch vụ bao gồm</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {tour.service.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'>
                    <span className='text-green-500 text-lg'>✓</span>
                    <p className='text-sm'>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-3'>Lịch trình chi tiết</h3>
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{tour.schedule}</p>
            </div>
          </div>
        </div>

        {/* Right column - Booking form */}
        <div className='lg:col-span-1'>
          <div className='bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-lg' id="booking-form-section">
            <div className='mb-4'>
              <p className='text-3xl font-bold text-blue-600'>
                {tour.price?.toLocaleString('vi-VN')} {currency}
              </p>
              <p className='text-sm text-gray-600'>/ người</p>
            </div>

            {!showContactForm ? (
              <form onSubmit={handleProceedToContactForm} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Ngày khởi hành</label>
                  <input 
                    type='date' 
                    value={departureDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500' 
                    required 
                  />
                  
                  {checkingAvailability && (
                    <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                      <span className='inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></span>
                      Đang kiểm tra...
                    </p>
                  )}
                  
                  {availabilityInfo && !checkingAvailability && (
                    <div className={`mt-2 p-3 rounded-lg ${
                      availabilityInfo.status === 'available' ? 'bg-green-50 border border-green-200' :
                      availabilityInfo.status === 'limited' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      
                      <div className='flex items-center gap-2 text-xs'>
                        <div className='flex-1 bg-gray-200 rounded-full h-2 overflow-hidden'>
                          <div 
                            className={`h-full transition-all ${
                              availabilityInfo.status === 'available' ? 'bg-green-500' :
                              availabilityInfo.status === 'limited' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${availabilityInfo.occupancyRate}%` }}
                          />
                        </div>
                        <span className='font-medium whitespace-nowrap'>
                          {availabilityInfo.availableSlots}/{availabilityInfo.maxGuests} chỗ
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>Số khách</label>
                  <input 
                    type='number' 
                    min={1} 
                    max={availabilityInfo ? Math.min(tour.guest, availabilityInfo.availableSlots) : tour.guest}
                    value={guestCount}
                    onChange={(e) => handleGuestCountChange(Number(e.target.value))}
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500'
                    required 
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Tối đa {availabilityInfo ? Math.min(tour.guest, availabilityInfo.availableSlots) : tour.guest} khách
                  </p>
                </div>

                <div className='border-t pt-4'>
                  <div className='flex justify-between mb-2'>
                    <span className='text-sm text-gray-600'>Giá x {guestCount} người</span>
                    <span className='text-sm font-semibold'>
                      {(tour.price * guestCount).toLocaleString('vi-VN')} {currency}
                    </span>
                  </div>
                  <div className='flex justify-between mb-4'>
                    <span className='font-semibold'>Tổng cộng</span>
                    <span className='text-lg font-bold text-blue-600'>
                      {(tour.price * guestCount).toLocaleString('vi-VN')} {currency}
                    </span>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={availabilityInfo && availabilityInfo.availableSlots === 0}
                  className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                    text-white font-semibold py-3 rounded-lg transition-all duration-200 
                    hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Tiếp tục
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitBooking} className='space-y-4' id="contact-info-section">
                <div className='bg-blue-50 rounded-lg p-3 mb-4'>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='text-gray-600'>Ngày:</span>
                    <span className='font-medium'>
                      {new Date(departureDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='text-gray-600'>Số khách:</span>
                    <span className='font-medium'>{guestCount} người</span>
                  </div>
                  <div className='flex justify-between text-sm pt-2 border-t border-blue-200'>
                    <span className='font-semibold'>Tổng:</span>
                    <span className='font-bold text-blue-600'>
                      {(tour.price * guestCount).toLocaleString('vi-VN')} {currency}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowContactForm(false)}
                    className='text-xs text-blue-600 hover:underline mt-2'
                  >
                    ← Chỉnh sửa
                  </button>
                </div>

                <h3 className='text-sm font-semibold text-gray-800 mb-3'>
                  Thông tin liên hệ
                </h3>

                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Họ và tên <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={contactInfo.name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      placeholder='Nguyễn Văn A'
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
                        ${contactErrors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {contactErrors.name && (
                      <p className='text-red-500 text-xs mt-1'>{contactErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Số điện thoại <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='tel'
                      value={contactInfo.phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder='0912345678'
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
                        ${contactErrors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {contactErrors.phone && (
                      <p className='text-red-500 text-xs mt-1'>{contactErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Số CMND/CCCD <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={contactInfo.cccd}
                      onChange={(e) => handleContactChange('cccd', e.target.value)}
                      placeholder='001234567890'
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
                        ${contactErrors.cccd ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {contactErrors.cccd && (
                      <p className='text-red-500 text-xs mt-1'>{contactErrors.cccd}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      value={contactInfo.email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder='example@email.com'
                      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
                        ${contactErrors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    />
                    {contactErrors.email && (
                      <p className='text-red-500 text-xs mt-1'>{contactErrors.email}</p>
                    )}
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={bookingInProgress}
                  className='w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                    text-white font-semibold py-3 rounded-lg transition-all duration-200 
                    hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2'
                >
                  {bookingInProgress ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Đang xử lý...
                    </>
                  ) : (
                    '✓ Xác nhận đặt tour'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Component */}
      <TourReviews tourId={id} />
    </div>
  )
}

export default TourDetails;
