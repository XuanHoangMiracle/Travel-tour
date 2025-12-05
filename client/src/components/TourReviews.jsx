import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const TourReviews = ({ tourId }) => {
  const { axios, getToken, user } = useAppContext();
  
  const [reviews, setReviews] = useState([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const Star = ({ active }) => (
    <span className={active ? 'text-amber-500' : 'text-gray-300'}>★</span>
  );

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/comments/tour/${tourId}`);
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

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
        `/api/comments/${tourId}`,
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

  useEffect(() => {
    if (tourId) {
      fetchComments();
    }
  }, [tourId]);

  if (loading) {
    return (
      <div className='mt-16 text-center py-8'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
        <p className='text-gray-500 mt-2 text-sm'>Đang tải bình luận...</p>
      </div>
    );
  }

  return (
    <div className='mt-16'>
      <h3 className='text-2xl font-playfair font-semibold mb-6'>
        Đánh giá/Bình luận ({reviews.length})
      </h3>

      {/* Review Form */}
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
              {[1, 2, 3, 4, 5].map(n => (
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
              onClick={() => { 
                setRatingInput(5); 
                setCommentInput(''); 
              }}
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

      {/* Reviews List */}
      <div className='space-y-4'>
        {reviews.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-xl'>
            <p className='text-gray-500'>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          reviews.map(review => (
            <article 
              key={review._id} 
              className='bg-white rounded-xl border p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                    {(review.username || 'K')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className='font-semibold'>{review.username || 'Khách ẩn danh'}</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-1 text-amber-500'>
                  {'★'.repeat(review.rating)}
                  <span className='text-gray-300'>{'★'.repeat(5 - review.rating)}</span>
                </div>
              </div>
              <p className='text-gray-700 whitespace-pre-line leading-relaxed'>
                {review.comment}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default TourReviews;
