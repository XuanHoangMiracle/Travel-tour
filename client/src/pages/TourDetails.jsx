import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets';
import StarRating from '../components/StarRating';

const TourDetails = () => {
  const { id } = useParams();
  const [tour, setTour] = React.useState(null);
  const [mainImage, setMainImage] = React.useState(null);


  // --- State cho đánh giá & bình luận (mock) ---
const [reviews, setReviews] = React.useState([
  { id: 'r1', rating: 5, content: 'Trải nghiệm rất tuyệt! HDV thân thiện.', createdAt: '2025-09-20T09:15:00Z' },
  { id: 'r2', rating: 4, content: 'Khách sạn ổn, xe đưa đón đúng giờ.', createdAt: '2025-09-22T14:30:00Z' },
]);
const [ratingInput, setRatingInput] = React.useState(5);
const [commentInput, setCommentInput] = React.useState('');
const [submittingReview, setSubmittingReview] = React.useState(false);

// helper hiển thị sao
const Star = ({ active }) => (
  <span className={active ? 'text-amber-500' : 'text-gray-300'}>★</span>
);

// submit (mock)
const handleSubmitReview = (e) => {
  e.preventDefault();
  if (!commentInput.trim()) return;

  setSubmittingReview(true);
  const newReview = {
    id: crypto.randomUUID(),
    rating: ratingInput,
    content: commentInput.trim(),
    createdAt: new Date().toISOString(),
  };
  setTimeout(() => {
    setReviews((prev) => [newReview, ...prev]);
    setRatingInput(5);
    setCommentInput('');
    setSubmittingReview(false);
  }, 300);
};


  useEffect(() => {
    const tour = roomsDummyData.find((room) => room._id === id)
    tour && setTour(tour);
    tour && setMainImage(tour.images[0]);
  }, []);

  return tour && (
    <div className='py-28 md:py-36 px-4 md:px-16 lg:px-24 xl:px-32'>
      {/* Room details*/}
      <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
        <h1>{tour.hotel.name} <span>({tour.roomType})</span> </h1>
        <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
      </div>

      {/* Room rating */}
      <div className='flex items-center gap-1 mt-2'>
        <StarRating />
        <p className='ml-2'>200+ reviews</p>
      </div>

      {/* Room address */}
      <div className='flex items-center gap-1 text-gray-500 mt-2'>
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{tour.hotel.address}</span>
      </div>

      {/* Room images */}
      <div className='flex flex-col lg:flex-row mt-6 gap-6'>
        <div className='lg:w-1/2 w-full '>
          <img src={mainImage} alt="Tour Image" className='w-full rounded-xl shadow-lg object-cover' />
        </div>
        <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
          {tour?.images.length > 1 && tour.images.map((image, index) => (
            <img
              onClick={() => setMainImage(image)}
              key={index}
              src={image}
              alt='Tour Image'
              className={`w-full rounded-xl shadow-lg object-cover cursor-pointer ${mainImage === image && 'outline-2 outline-orange-500'}`}
            />
          ))}
        </div>
      </div>

      {/* Room highlight */}
      <div className='flex flex-col md:flex-row md:justify-between mt-6 gap-4 mt-10'>
        <div className='flex flex-col'>
          <h1 className='text-3xl md:text-4xl font-playfair'>Trải nghiệm kỳ nghỉ tuyệt vời nhất</h1>
          <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
            {tour.amenities.map((item, index) => (
              <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                <p className='text-xs'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Room price */}
        <p className='text-2xl font-medium'>{tour.pricePerNight}vnđ</p>
      </div>
      {/*Check*/}
          <form className="mt-10">
      <div
        className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4
                  bg-white shadow-[0_0_20px_rgba(0,0,0,0.15)] p-5 rounded-xl">
        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="depart" className="font-medium text-gray-700">
            Ngày khởi hành
          </label>
          <input type="date" id="depart" className="mt-1.5 w-full md:w-56 h-11 rounded-lg border border-gray-300
            px-3 outline-none text-gray-700" required />
        </div>
        <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="guests" className="font-medium text-gray-700">
            Số khách
          </label>
          <input id="guests" type="number" min={1} max={20} placeholder="0"
            className="mt-1.5 w-full md:w-40 h-11 rounded-lg border border-gray-300
            px-3 outline-none text-gray-700" required />
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull active:scale-95 transition-all
                    text-white rounded-lg h-11 md:h-11 w-full md:w-auto
                    px-6 text-base cursor-pointer md:mt-0">Đặt Ngay
        </button>
      </div>
    </form>

    {/* thông tin */}
      <div className="mt-6 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title} icon`} className="w-6 h-6" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form đánh giá & bình luận (mock) */}
<div className="mt-8">
  <h3 className="text-xl font-semibold">Đánh giá & Bình luận</h3>

  {/* Form nhập */}
  <form onSubmit={handleSubmitReview} className="mt-4 rounded-xl border p-4 space-y-4">
    <div>
      <label className="block text-sm font-medium">Đánh giá của bạn</label>
      <div className="mt-1 flex items-center gap-2">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRatingInput(n)}
            aria-label={`Chọn ${n} sao`}
            className="text-xl leading-none"
          >
            <Star active={n <= ratingInput} />
          </button>
        ))}
        <span className="text-sm text-gray-500">{ratingInput}/5</span>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium">Bình luận</label>
      <textarea
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Chia sẻ trải nghiệm của bạn về tour này…"
        className="mt-1 w-full min-h-28 rounded-md border px-3 py-2 outline-none focus:border-amber-500"
        maxLength={500}
        required
      />
      <div className="mt-1 text-xs text-gray-500">
        {500 - commentInput.length} ký tự còn lại
      </div>
    </div>

    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={() => { setRatingInput(5); setCommentInput(''); }}
        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
      >
        Reset
      </button>
      <button
        type="submit"
        disabled={submittingReview}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {submittingReview ? 'Đang gửi…' : 'Gửi đánh giá'}
      </button>
    </div>
  </form>

        {/* Danh sách bình luận */}
        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          ) : (
            reviews.map(r => (
              <article key={r.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Khách ẩn danh</p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div aria-label={`${r.rating} sao`} className="text-amber-500">
                    {'★'.repeat(r.rating)}<span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{r.content}</p>
              </article>
            ))
          )}
        </div>
</div>

    </div>
  )
}

export default TourDetails
