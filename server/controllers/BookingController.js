import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

// ✅ User tạo booking mới
export const createBooking = async (req, res) => {
    try {
        const { 
            tourId, 
            numberOfGuests, 
            bookingDate, 
            contactInfo 
        } = req.body;

        // Kiểm tra tour tồn tại
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tour không tồn tại' 
            });
        }

        // Kiểm tra số khách không vượt quá giới hạn
        if (numberOfGuests > tour.guest) {
            return res.status(400).json({ 
                success: false, 
                message: `Tour chỉ nhận tối đa ${tour.guest} khách` 
            });
        }

        // Tính tổng tiền
        const totalPrice = tour.price * numberOfGuests;

        // Tạo booking
        const booking = await Booking.create({
            user: req.user._id,
            tour: tourId,
            numberOfGuests,
            bookingDate: new Date(bookingDate),
            totalPrice,
            contactInfo
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('tour', 'name location price time')
            .populate('user', 'username email');

        res.status(201).json({
            success: true,
            message: 'Đặt tour thành công!',
            data: populatedBooking
        });
    } catch (error) {
        console.error('createBooking error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi tạo booking'
        });
    }
};

// ✅ User xem bookings của mình
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('tour', 'name location price images time')
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy danh sách booking'
        });
    }
};

// ✅ User hủy booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findOne({
            _id: bookingId,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy booking' 
            });
        }

        if (booking.isPaid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Không thể hủy booking đã thanh toán' 
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Hủy booking thành công'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi hủy booking'
        });
    }
};
