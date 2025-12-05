import express from 'express';
import {
  getAllUsers,
  getAllBookings,
  getAllTransactions,
  getAdminStats,
  getDashboardData,       
  updateBookingStatus,
  updatePaymentStatus,     
  deleteBooking,
  getBookingDetails,
  getRevenueByDateRange,
} from '../controllers/adminController.js';

const router = express.Router();


//DASHBOARD
router.get('/dashboard', getDashboardData);
router.get('/stats', getAdminStats);

//USER MANAGEMENT 
router.get('/users', getAllUsers);

//BOOKING MANAGEMENT
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingDetails);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/bookings/:id/payment', updatePaymentStatus); 
router.delete('/bookings/:id', deleteBooking);


router.get('/transactions', getAllTransactions);


router.get('/revenue', getRevenueByDateRange);

export default router;
