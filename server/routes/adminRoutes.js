import express from 'express';
import { getDashboardData, updatePaymentStatus } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', getDashboardData);
adminRouter.put('/bookings/:bookingId/payment', updatePaymentStatus);

export default adminRouter;
