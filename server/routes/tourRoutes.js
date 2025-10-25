import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { createTour,  deleteTour,getTourById,getTour,toggleTourAvailability, updateTour } from '../controllers/tourController.js';

const tourRouter = express.Router();

tourRouter.get('/', getTour);
tourRouter.get('/:id', getTourById);  

tourRouter.post('/', upload.array("images", 4), createTour);
tourRouter.post('/toggle-availability', toggleTourAvailability);
tourRouter.put('/:id', updateTour);

tourRouter.delete('/:id', deleteTour);

export default tourRouter;