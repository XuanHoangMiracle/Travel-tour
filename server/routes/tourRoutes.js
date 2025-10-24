import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { createTour, getTour,toggleTourAvailability, updateTour } from '../controllers/tourController.js';

const tourRouter = express.Router();

tourRouter.post('/', upload.array("images", 4), createTour);
tourRouter.get('/', getTour);
tourRouter.put('/:id', updateTour);
tourRouter.post('/toggle-availability', toggleTourAvailability);


export default tourRouter;