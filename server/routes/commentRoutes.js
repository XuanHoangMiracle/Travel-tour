import express from 'express';
import { addComment, getCommentsByTour } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const commentRouter = express.Router();

commentRouter.post('/:tourId', protect, addComment);

commentRouter.get('/tour/:tourId', getCommentsByTour);

export default commentRouter;
