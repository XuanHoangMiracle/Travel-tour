import Booking from '../models/Booking.js';

// ✅ Dashboard - Lấy thống kê
export const getDashboardData = async (req, res) => {
    try {
        // Lấy 10 booking gần nhất
        const bookings = await Booking.find()
            .populate('user', 'username email')
            .populate('tour', 'name price location')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Tổng số bookings
        const totalBookings = await Booking.countDocuments();

        // Tổng doanh thu (chỉ tính đã thanh toán)
        const revenueResult = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.json({
            success: true,
            dashboardData: {
                bookings,
                totalBookings,
                totalRevenue
            }
        });
    } catch (error) {
        console.error('getDashboardData error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy dữ liệu dashboard'
        });
    }
};

// ✅ Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { isPaid } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { isPaid },
            { new: true }
        ).populate('user', 'username')
         .populate('tour', 'name');

        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy booking' 
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật trạng thái thanh toán thành công',
            data: booking
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi cập nhật trạng thái'
        });
    }
};
