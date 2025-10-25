import Comment from "../models/Comments.js";
import Tour from "../models/Tour.js";

export const addComment = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { rating, comment, user, username } = req.body;

    console.log('Add comment request:', { tourId, rating, comment, user, username });

    if (!rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating và comment là bắt buộc' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating phải từ 1 đến 5' 
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.log("Tour không tồn tại:", tourId);
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy tour" 
      });
    }

    const newComment = await Comment.create({
      tour: tourId,
      rating: Number(rating),
      comment: comment.trim(),
      user: user || null,
      username: username || 'Khách ẩn danh'
    });
    const allComments = await Comment.find({ tour: tourId });
    const totalRating = allComments.reduce((sum, c) => sum + c.rating, 0);
    const averageRating = totalRating / allComments.length;

    await Tour.findByIdAndUpdate(tourId, {
      averageRating: averageRating,
      reviewCount: allComments.length
    });


    console.log(" Đã lưu comment:", newComment);

    res.status(201).json({
      success: true,
      message: "Thêm bình luận thành công",
      data: newComment,
    });
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Thêm bình luận thất bại", 
      error: error.message 
    });
  }
};

export const getCommentsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const comments = await Comment.find({ tour: tourId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error(" getCommentsByTour error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Không thể lấy bình luận", 
      error: error.message 
    });
  }
};
