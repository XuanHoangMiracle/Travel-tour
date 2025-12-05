import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBooking,
  cancelBooking,
  checkAvailability,
  getTourAvailabilityCalendar,
  getMyBookings,
  getBookingById,
  createPayment,
  verifyPaymentReturn,
  handlePaymentIPN,
  getMyTransactions
} from '../controllers/BookingController.js';

const router = express.Router();


router.get('/payment/callback', verifyPaymentReturn);
router.post('/payment/ipn', handlePaymentIPN);


router.get('/availability/check', checkAvailability);
router.get('/availability/calendar/:tourId', getTourAvailabilityCalendar);


router.get('/my-transactions', protect, getMyTransactions);


router.post('/create', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.post('/create-payment', protect, createPayment);

router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
