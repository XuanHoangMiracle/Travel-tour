import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import TourAvailability from "../models/TourAvailability.js";
import mongoose from "mongoose";
import vnpay from "../configs/vnpay.js";
import TransactionService from "../models/Transaction.js";
import pool from '../configs/postgresql.js';
import crypto from 'crypto';

//   Validate contact info helper
function validateContactInfo(contactInfo) {
  const errors = [];

  if (!contactInfo) {
    return ['Thông tin liên hệ là bắt buộc'];
  }

  // Validate name
  if (!contactInfo.name || !contactInfo.name.trim()) {
    errors.push('Họ tên là bắt buộc');
  } else if (contactInfo.name.trim().length < 3) {
    errors.push('Họ tên phải có ít nhất 3 ký tự');
  }

  // Validate phone
  const phoneRegex = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;
  if (!contactInfo.phone || !contactInfo.phone.trim()) {
    errors.push('Số điện thoại là bắt buộc');
  } else if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ''))) {
    errors.push('Số điện thoại không hợp lệ');
  }

  // Validate CCCD
  const cccdRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  if (!contactInfo.cccd || !contactInfo.cccd.trim()) {
    errors.push('Số CCCD/CMND là bắt buộc');
  } else if (!cccdRegex.test(contactInfo.cccd.replace(/\s/g, ''))) {
    errors.push('CCCD phải là 9 hoặc 12 số');
  }

  // Validate email (optional)
  if (contactInfo.email && contactInfo.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      errors.push('Email không hợp lệ');
    }
  }

  // Validate notes length
  if (contactInfo.notes && contactInfo.notes.length > 500) {
    errors.push('Ghi chú không được quá 500 ký tự');
  }

  return errors;
}

export const checkAvailability = async (req, res) => {
  try {
    const { tourId, date } = req.query;

    console.log('=== CHECK AVAILABILITY ===');
    console.log('TourId:', tourId);
    console.log('Date:', date);

    if (!tourId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tourId hoặc date'
      });
    }

    //   Get tour info
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour không tồn tại'
      });
    }

    //   Parse date to start of day (00:00:00)
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    console.log('Parsed booking date:', bookingDate);

    //   Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt tour cho ngày trong quá khứ'
      });
    }

    //   Find or create availability record
    let availability = await TourAvailability.findOne({
      tour: tourId,
      date: bookingDate
    });

    if (!availability) {
      //   Create new availability record
      availability = new TourAvailability({
        tour: tourId,
        date: bookingDate,
        maxGuests: tour.guest,
        bookedGuests: 0,
        availableSlots: tour.guest,
        status: 'available',
        bookings: []
      });
      await availability.save();
      console.log('  Created new availability record');
    }

    console.log('Availability:', {
      maxGuests: availability.maxGuests,
      bookedGuests: availability.bookedGuests,
      availableSlots: availability.availableSlots,
      status: availability.status
    });

    res.json({
      success: true,
      data: {
        tourId,
        date: bookingDate,
        maxGuests: availability.maxGuests,
        bookedGuests: availability.bookedGuests,
        availableSlots: availability.availableSlots,
        status: availability.status,
        occupancyRate: ((availability.bookedGuests / availability.maxGuests) * 100).toFixed(2)
      }
    });

  } catch (error) {
    console.error('checkAvailability error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra tình trạng chỗ',
      error: error.message
    });
  }
};

//   GET TOUR AVAILABILITY CALENDAR (30 days)
export const getTourAvailabilityCalendar = async (req, res) => {
  try {
    const { tourId } = req.params;

    console.log('=== GET AVAILABILITY CALENDAR ===');
    console.log('TourId:', tourId);

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour không tồn tại'
      });
    }

    //   Get 30 days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);

    //   Find all availability records in range
    const availabilityRecords = await TourAvailability.find({
      tour: tourId,
      date: { $gte: today, $lte: endDate }
    }).sort({ date: 1 });

    //   Create calendar array (30 days)
    const calendar = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      const existing = availabilityRecords.find(
        record => record.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
      );

      if (existing) {
        calendar.push({
          date: currentDate,
          maxGuests: existing.maxGuests,
          bookedGuests: existing.bookedGuests,
          availableSlots: existing.availableSlots,
          status: existing.status
        });
      } else {
        //   Date not booked yet - fully available
        calendar.push({
          date: currentDate,
          maxGuests: tour.guest,
          bookedGuests: 0,
          availableSlots: tour.guest,
          status: 'available'
        });
      }
    }

    res.json({
      success: true,
      data: {
        tourId,
        tourName: tour.name,
        calendar
      }
    });

  } catch (error) {
    console.error('getTourAvailabilityCalendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy lịch availability',
      error: error.message
    });
  }
};

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tourId, numberOfGuests, bookingDate, contactInfo } = req.body;
    const userId = req.user._id;

    console.log('=== CREATE BOOKING ===');
    console.log('User:', userId);
    console.log('Tour:', tourId);
    console.log('Guests:', numberOfGuests);
    console.log('Date:', bookingDate);

    //   Validate input
    if (!tourId || !numberOfGuests || !bookingDate || !contactInfo) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    //   Get tour
    const tour = await Tour.findById(tourId).session(session);
    if (!tour) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Tour không tồn tại'
      });
    }

    //   Parse booking date
    const bookingDateOnly = new Date(bookingDate);
    bookingDateOnly.setHours(0, 0, 0, 0);

    //   Check date is not in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDateOnly < today) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt tour cho ngày trong quá khứ'
      });
    }

    //   Find or create availability
    let availability = await TourAvailability.findOne({
      tour: tourId,
      date: bookingDateOnly
    }).session(session);

    if (!availability) {
      availability = new TourAvailability({
        tour: tourId,
        date: bookingDateOnly,
        maxGuests: tour.guest,
        bookedGuests: 0,
        availableSlots: tour.guest,
        status: 'available',
        bookings: []
      });
    }

    //   Check availability
    if (availability.availableSlots < numberOfGuests) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${availability.availableSlots} chỗ trống. Không đủ chỗ cho ${numberOfGuests} khách`
      });
    }

    if (numberOfGuests > tour.guest) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Số khách tối đa là ${tour.guest} người`
      });
    }

    //   Create booking
    const totalPrice = tour.price * numberOfGuests;

    const newBooking = new Booking({
      user: userId,
      tour: tourId,
      numberOfGuests,
      bookingDate: bookingDateOnly,
      totalPrice,
      contactInfo,
      isPaid: false,
      status: 'pending'
    });

    await newBooking.save({ session });

    //   Update availability
    availability.bookedGuests += numberOfGuests;
    availability.bookings.push(newBooking._id);
    await availability.save({ session });

    console.log('  Availability updated:', {
      bookedGuests: availability.bookedGuests,
      availableSlots: availability.availableSlots,
      status: availability.status
    });

    await session.commitTransaction();

    //   Populate and return
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('tour', 'name location images price time')
      .populate('user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Đặt tour thành công',
      data: populatedBooking
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('createBooking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo booking',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

//   Lấy bookings của user
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate('tour', 'name location images price time guest')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách bookings',
      error: error.message
    });
  }
};

//   Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findOne({
      _id: id,
      user: userId
    })
    .populate('tour', 'name location images price time guest')
    .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('getBookingById error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin booking',
      error: error.message
    });
  }
};

//   CANCEL BOOKING - TRẢ LẠI AVAILABILITY
export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id).session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    //   Check ownership
    if (booking.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền hủy booking này'
      });
    }

    //   Check if already cancelled
    if (booking.status === 'cancelled') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Booking đã bị hủy trước đó'
      });
    }

    //   Update booking status
    booking.status = 'cancelled';
    await booking.save({ session });

    //   Update availability - trả lại chỗ
    const bookingDateOnly = new Date(booking.bookingDate);
    bookingDateOnly.setHours(0, 0, 0, 0);

    const availability = await TourAvailability.findOne({
      tour: booking.tour,
      date: bookingDateOnly
    }).session(session);

    if (availability) {
      availability.bookedGuests -= booking.numberOfGuests;
      availability.bookings = availability.bookings.filter(
        b => b.toString() !== booking._id.toString()
      );
      await availability.save({ session });

      console.log('  Availability restored:', {
        bookedGuests: availability.bookedGuests,
        availableSlots: availability.availableSlots,
        status: availability.status
      });
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Đã hủy booking thành công',
      data: booking
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('cancelBooking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hủy booking',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};


export const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id || req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate('tour', 'name')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thanh toán booking này'
      });
    }

    if (booking.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Booking đã được thanh toán'
      });
    }

    const vnp_TxnRef = `${bookingId}_${Date.now()}`;
    const orderInfo = `Thanh toan tour ${booking.tour?.name || 'Unknown'}`;

    try {
      const existingTransaction = await TransactionService.getByBookingId(bookingId);
      if (existingTransaction && existingTransaction.status === 'pending') {
        await pool.query(
          'DELETE FROM transactions WHERE booking_id = $1 AND status = $2', 
          [bookingId, 'pending']
        );
      }
    } catch (err) {
      console.log('No existing transaction to delete');
    }

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: booking.totalPrice,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:3000/api/bookings/payment/callback',
      vnp_IpAddr: req.ip || req.connection.remoteAddress || '127.0.0.1',
      vnp_Locale: 'vn',
    });

    await TransactionService.create({
      booking_id: bookingId,
      user_id: userId,
      vnp_txn_ref: vnp_TxnRef,
      amount: booking.totalPrice,
      status: 'pending',
      payment_method: 'vnpay',
      vnp_order_info: orderInfo
    });

    res.json({
      success: true,
      message: 'Tạo link thanh toán thành công',
      paymentUrl,
      vnp_TxnRef
    });

  } catch (error) {
    console.error('createPayment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo thanh toán',
      error: error.message
    });
  }
};

export const verifyPaymentReturn = async (req, res) => {
  try {
    console.log('=== PAYMENT CALLBACK RECEIVED ===');
    console.log('Query params:', req.query);

    const VNP_SECRET = process.env.VNP_SECRET;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (!VNP_SECRET) {
      console.error('❌ VNP_SECRET not configured');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?message=${encodeURIComponent('Cấu hình thanh toán lỗi')}">
        </head>
        <body>
          <script>window.location.href="${frontendUrl}/payment/failure?message=${encodeURIComponent('Cấu hình thanh toán lỗi')}";</script>
        </body>
        </html>
      `);
    }

    // ... (giữ nguyên code verify signature)

    const rawQuery = req.url.split('?')[1];
    if (!rawQuery) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?message=${encodeURIComponent('Invalid callback')}">
        </head>
        <body>
          <script>window.location.href="${frontendUrl}/payment/failure?message=${encodeURIComponent('Invalid callback')}";</script>
        </body>
        </html>
      `);
    }

    const params = {};
    rawQuery.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = value;
    });

    const secureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    
    const hmac = crypto.createHmac('sha512', VNP_SECRET);
    const calculated = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== calculated) {
      console.error('❌ Signature mismatch!');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?message=${encodeURIComponent('Chữ ký không hợp lệ')}">
        </head>
        <body>
          <script>window.location.href="${frontendUrl}/payment/failure?message=${encodeURIComponent('Chữ ký không hợp lệ')}";</script>
        </body>
        </html>
      `);
    }

    const vnpParams = req.query;
    const vnp_TxnRef = vnpParams['vnp_TxnRef'];
    const vnp_ResponseCode = vnpParams['vnp_ResponseCode'];
    const vnp_TransactionNo = vnpParams['vnp_TransactionNo'];
    const vnp_Amount = parseInt(vnpParams['vnp_Amount']) / 100;
    const bookingId = vnp_TxnRef.split('_')[0];

    console.log('Transaction info:', { bookingId, vnp_TxnRef, vnp_ResponseCode });

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error('❌ Booking not found:', bookingId);
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?bookingId=${bookingId}&message=${encodeURIComponent('Không tìm thấy booking')}">
        </head>
        <body>
          <script>window.location.href="${frontendUrl}/payment/failure?bookingId=${bookingId}&message=${encodeURIComponent('Không tìm thấy booking')}";</script>
        </body>
        </html>
      `);
    }

    // Update transaction
    try {
      await TransactionService.update(bookingId, {
        vnp_transaction_no: vnp_TransactionNo,
        vnp_response_code: vnp_ResponseCode,
        vnp_transaction_status: vnpParams['vnp_TransactionStatus'],
        vnp_bank_code: vnpParams['vnp_BankCode'],
        vnp_card_type: vnpParams['vnp_CardType'],
        vnp_pay_date: vnpParams['vnp_PayDate'],
        status: vnp_ResponseCode === '00' ? 'success' : 'failed'
      });
    } catch (err) {
      console.error('Transaction update error:', err);
    }

    // ✅ REDIRECT THEO RESPONSE CODE
    if (vnp_ResponseCode === '00') {
      // SUCCESS
      booking.isPaid = true;
      booking.status = 'confirmed';
      booking.paidAt = new Date();
      await booking.save();

      console.log('✅ PAYMENT SUCCESS:', bookingId);

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Thanh toán thành công</title>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/success?bookingId=${bookingId}&amount=${vnp_Amount}">
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>✅ Thanh toán thành công!</h2>
          <p>Đang chuyển hướng...</p>
          <script>
            window.location.href="${frontendUrl}/payment/success?bookingId=${bookingId}&amount=${vnp_Amount}";
          </script>
        </body>
        </html>
      `);

    } else {
      // FAILURE
      const errorMessages = {
        '07': 'Giao dịch bị nghi ngờ gian lận',
        '09': 'Thẻ chưa đăng ký dịch vụ InternetBanking',
        '10': 'Xác thực thông tin thẻ không đúng quá 3 lần',
        '11': 'Đã hết hạn chờ thanh toán',
        '12': 'Thẻ/Tài khoản bị khóa',
        '13': 'Nhập sai mật khẩu OTP',
        '24': 'Khách hàng hủy giao dịch',
        '51': 'Tài khoản không đủ số dư',
        '65': 'Vượt quá hạn mức giao dịch trong ngày',
        '75': 'Ngân hàng thanh toán đang bảo trì',
        '79': 'Nhập sai mật khẩu quá số lần quy định',
        '99': 'Lỗi không xác định'
      };

      const errorMessage = errorMessages[vnp_ResponseCode] || 'Giao dịch thất bại';
      console.log('❌ PAYMENT FAILED:', { vnp_ResponseCode, errorMessage });

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Thanh toán thất bại</title>
          <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?bookingId=${bookingId}&code=${vnp_ResponseCode}&message=${encodeURIComponent(errorMessage)}">
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>❌ Thanh toán thất bại</h2>
          <p>${errorMessage}</p>
          <p>Đang chuyển hướng...</p>
          <script>
            window.location.href="${frontendUrl}/payment/failure?bookingId=${bookingId}&code=${vnp_ResponseCode}&message=${encodeURIComponent(errorMessage)}";
          </script>
        </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('=== CALLBACK ERROR ===', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="refresh" content="0; url=${frontendUrl}/payment/failure?message=${encodeURIComponent('Lỗi hệ thống')}">
      </head>
      <body>
        <script>window.location.href="${frontendUrl}/payment/failure?message=${encodeURIComponent('Lỗi hệ thống')}";</script>
      </body>
      </html>
    `);
  }
};

//  HANDLE PAYMENT IPN - DÙNG RAW QUERY
export const handlePaymentIPN = async (req, res) => {
  try {
    const VNP_SECRET = process.env.VNP_SECRET;
    
    if (!VNP_SECRET) {
      return res.status(200).json({ RspCode: '99', Message: 'Config error' });
    }

    // Parse raw query string
    const rawQuery = req.url.split('?')[1];
    if (!rawQuery) {
      return res.status(200).json({ RspCode: '99', Message: 'Invalid request' });
    }

    const params = {};
    rawQuery.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[key] = value;
    });

    const secureHash = params['vnp_SecureHash'];
    
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map(key => `${key}=${params[key]}`).join('&');

    const hmac = crypto.createHmac('sha512', VNP_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      console.error('IPN: Invalid signature');
      return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
    }

    // Sử dụng decoded params
    const vnpParams = req.query;
    const vnp_TxnRef = vnpParams['vnp_TxnRef'];
    const vnp_ResponseCode = vnpParams['vnp_ResponseCode'];
    const bookingId = vnp_TxnRef.split('_')[0];

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }

    const transaction = await TransactionService.getByBookingId(bookingId);
    if (!transaction) {
      return res.status(200).json({ RspCode: '01', Message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(200).json({ RspCode: '02', Message: 'Order already processed' });
    }

    await TransactionService.update(bookingId, {
      vnp_transaction_no: vnpParams['vnp_TransactionNo'],
      vnp_response_code: vnp_ResponseCode,
      vnp_transaction_status: vnpParams['vnp_TransactionStatus'],
      vnp_bank_code: vnpParams['vnp_BankCode'],
      vnp_pay_date: vnpParams['vnp_PayDate'],
      status: vnp_ResponseCode === '00' ? 'success' : 'failed'
    });

    if (vnp_ResponseCode === '00') {
      if (!booking.isPaid) {
        booking.isPaid = true;
        booking.status = 'confirmed';
        booking.paidAt = new Date();
        await booking.save();
      }
      console.log('IPN: Payment success');
      return res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
      console.log('IPN: Payment failed');
      return res.status(200).json({ RspCode: '00', Message: 'Payment failed' });
    }

  } catch (error) {
    console.error('handlePaymentIPN error:', error);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

//  GET MY TRANSACTIONS - POPULATE TOUR INFO
export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log('=== GET MY TRANSACTIONS ===');
    console.log('User ID:', userId);

    // Get all user's bookings
    const bookings = await Booking.find({ user: userId })
      .populate('tour', 'name location images')
      .lean();

    console.log('User bookings:', bookings.length);

    const bookingIds = bookings.map(b => b._id.toString());

    // Get transactions from PostgreSQL
    const transactionsResult = await pool.query(
      `SELECT * FROM transactions 
       WHERE booking_id = ANY($1::text[])
       ORDER BY created_at DESC`,
      [bookingIds]
    );

    // Merge transaction data with tour info
    const transactionsWithTour = transactionsResult.rows.map(transaction => {
      const booking = bookings.find(b => b._id.toString() === transaction.booking_id);
      return {
        ...transaction,
        tour: booking?.tour || null,
        booking: {
          _id: booking?._id,
          totalPrice: booking?.totalPrice,
          numberOfGuests: booking?.numberOfGuests
        }
      };
    });

    console.log('Transactions found:', transactionsWithTour.length);

    res.json({
      success: true,
      data: transactionsWithTour
    });

  } catch (error) {
    console.error('getMyTransactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy transactions',
      error: error.message
    });
  }
};
