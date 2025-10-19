import { Router } from "express";
import { addComment, getCommentsByTour } from "../controllers/commentController.js";

const router = Router();

// POST /api/comments/:tourId → thêm bình luận cho tour
router.post("/tourId", addComment);

// GET /api/comments/:tourId → lấy tất cả bình luận của tour
router.get("/tourId", getCommentsByTour);

export default router;
