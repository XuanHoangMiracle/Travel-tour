import Comment from "../models/Comments.js";
import Tour from "../models/Tour.js";

export const addComment = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { rating, comment, user } = req.body;

    // Kiểm tra tour tồn tại
    const tour = await Tour.findById(tourId);
    if (!tour) {
      console.log("Tour không tồn tại:", tourId);
      return res.status(404).json({ success: false, message: "Không tìm thấy tour" });
    }

    // Tạo comment
    const newComment = await Comment.create({
      tour: tourId,
      rating,
      comment,
      user: user || null,
    });

    console.log("Đã lưu comment:", newComment);

    res.status(201).json({
      success: true,
      message: "Thêm bình luận thành công",
      data: newComment,
    });
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ success: false, message: "Thêm bình luận thất bại", error: error.message });
  }
};

// Lấy bình luận của 1 tour
export const getCommentsByTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const comments = await Comment.find({ tour: tourId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error("getCommentsByTour error:", error);
    res.status(500).json({ success: false, message: "Không thể lấy bình luận", error: error.message });
  }
};
