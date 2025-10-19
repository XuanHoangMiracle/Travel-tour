import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { createTour } from '../controllers/tourController.js';

const tourRouter = express.Router();

tourRouter.post('/', upload.array("images", 4), createTour);
// tourRouter.get("/", getTour);
// tourRouter.patch("/quantity-guest/:id", quantityGuest);

export default tourRouter;