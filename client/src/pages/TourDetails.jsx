import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const TourDetails = () => {
  const { id } = useParams();
  const { axios, getToken, user, currency } = useAppContext();
  
  const [tour, setTour] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comment states
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking states
  const [guestCount, setGuestCount] = useState(1);
  const [departureDate, setDepartureDate] = useState('');

  // Helper hiển thị sao
  const Star = ({ active }) => (
    <span className={active ? 'text-amber-500' : 'text-gray-300'}>★</span>
  );

  // tour details
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

  // Fetch comments
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/tour/${id}`);
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  //  Submit review với authentication
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!commentInput.trim()) {
      toast.error('Vui lòng nhập bình luận');
      return;
    }

    setSubmittingReview(true);
    try {
      const token = await getToken();
      
      const { data } = await axios.post(
        `/api/comments/${id}`,
        {
          rating: ratingInput,
          comment: commentInput.trim(),
          user: user?.id || null,
          username: user?.username || user?.firstName || 'Khách ẩn danh'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success('Gửi đánh giá thành công!');
        setReviews([data.data, ...reviews]);
        setRatingInput(5);
        setCommentInput('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Gửi đánh giá thất bại');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ✅ Handle booking
  const handleBooking = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt tour');
      return;
    }

    if (guestCount > tour.guest) {
      toast.error(`Số khách tối đa là ${tour.guest} người`);
      return;
    }

    if (!departureDate) {
      toast.error('Vui lòng chọn ngày khởi hành');
      return;
    }

    const bookingData = {
      tourId: id,
      guests: guestCount,
      departureDate: departureDate
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = `/book/${id}?guests=${guestCount}&date=${departureDate}`;
  };

  useEffect(() => {
    fetchTourDetails();
    fetchComments();
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
      {/* Tour details */}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 mb-4'>
        <h1 className='text-3xl md:text-4xl font-playfair font-bold'>{tour.name}</h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>HOT DEAL</p>
      </div>

      {/* Tour rating */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating rating={tour.averageRating} reviewCount={tour.reviewCount} />
        <p className='ml-2 text-sm text-gray-600'>({reviews.length} đánh giá)</p>
      </div>

      {/* Tour location */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" className='h-4 w-4'/>
        <span>{tour.location}</span>
      </div>

      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        {/* Main Image - Ảnh lớn bên trái */}
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
              {/* Hiển thị tối đa 4 ảnh */}
              {tour.images.slice(0, 4).map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt={`Tour ${index + 1}`}
                  className={`w-full block rounded-xl shadow-lg object-cover cursor-pointer aspect-[16/10] transition-all
                    ${mainImage === image 
                      ? 'outline outline-2 outline-orange-500 outline-offset-2 scale-105' 
                      : 'hover:scale-105 hover:shadow-xl'}`}
                />
              ))}
              
              {tour.images.length < 4 && 
                Array.from({ length: 4 - tour.images.length }).map((_, index) => (
                  <div 
                    key={`placeholder-${index}`}
                    className='w-full aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center'
                  >
                  </div>
                ))
              }
            </>
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div 
                key={`empty-${index}`}
                className='w-full aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center'
              >
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tour info grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10'>
        {/* Left column - Tour details */}
        <div className='lg:col-span-2'>
          <h2 className='text-2xl font-playfair font-semibold mb-4'>Chi tiết tour</h2>
          
          {/* Quick info */}
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

          {/* Services */}
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

          {/* Schedule */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-3'>Lịch trình chi tiết</h3>
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{tour.schedule}</p>
            </div>
          </div>
        </div>

        {/* Right column - Booking card */}
        <div className='lg:col-span-1'>
          <div className='bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-lg'>
            <div className='mb-4'>
              <p className='text-3xl font-bold text-blue-600'>
                {tour.price?.toLocaleString('vi-VN')} {currency}
              </p>
              <p className='text-sm text-gray-600'>/ người</p>
            </div>

            <form onSubmit={handleBooking} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Ngày khởi hành</label>
                <input 
                  type='date' 
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className='w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500' 
                  required 
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Số khách</label>
                <input 
                  type='number' 
                  min={1} 
                  max={tour.guest}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className='w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500'
                  required 
                />
                <p className='text-xs text-gray-500 mt-1'>Tối đa {tour.guest} khách</p>
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
                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                  text-white font-semibold py-3 rounded-lg transition-all duration-200 
                  hover:shadow-lg active:scale-95'>
                Đặt Tour Ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className='mt-16'>
        <h3 className='text-2xl font-playfair font-semibold mb-6'>
          Đánh giá Bình luận ({reviews.length})
        </h3>

        {!user ? (
          <div className='bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8 text-center'>
            <p className='text-gray-700 mb-4'>Vui lòng đăng nhập để đánh giá tour</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className='bg-white rounded-xl border p-6 mb-8 shadow-sm'>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Đánh giá của bạn</label>
              <div className='flex items-center gap-2'>
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    type='button'
                    onClick={() => setRatingInput(n)}
                    className='text-3xl leading-none hover:scale-110 transition-transform'
                  >
                    <Star active={n <= ratingInput} />
                  </button>
                ))}
                <span className='text-sm text-gray-500 ml-2'>{ratingInput}/5</span>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Bình luận</label>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder='Chia sẻ trải nghiệm của bạn về tour này…'
                className='w-full min-h-32 rounded-lg border px-4 py-3 outline-none focus:border-blue-500 resize-none'
                maxLength={500}
                required
              />
              <div className='mt-1 text-xs text-gray-500 text-right'>
                {500 - commentInput.length} ký tự còn lại
              </div>
            </div>

            <div className='flex items-center justify-end gap-3'>
              <button
                type='button'
                onClick={() => { setRatingInput(5); setCommentInput(''); }}
                className='px-5 py-2 rounded-lg border hover:bg-gray-50 transition-colors'
              >
                Reset
              </button>
              <button
                type='submit'
                disabled={submittingReview}
                className='px-5 py-2 rounded-lg bg-amber-500 text-white font-medium 
                  hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {submittingReview ? 'Đang gửi…' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews list */}
        <div className='space-y-4'>
          {reviews.length === 0 ? (
            <div className='text-center py-12 bg-gray-50 rounded-xl'>
              <p className='text-gray-500'>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            reviews.map(r => (
              <article key={r._id} className='bg-white rounded-xl border p-6 hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                      {(r.username || 'K')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className='font-semibold'>{r.username || 'Khách ẩn danh'}</p>
                      <p className='text-xs text-gray-500'>
                        {new Date(r.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 text-amber-500'>
                    {'★'.repeat(r.rating)}
                    <span className='text-gray-300'>{'★'.repeat(5 - r.rating)}</span>
                  </div>
                </div>
                <p className='text-gray-700 whitespace-pre-line leading-relaxed'>{r.comment}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TourDetails
