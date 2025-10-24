import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/BookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/', createBooking);
bookingRouter.get('/my-bookings', getMyBookings);
bookingRouter.put('/:bookingId/cancel', cancelBooking);

export default bookingRouter;
