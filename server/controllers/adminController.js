import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import TransactionService from "../models/Transaction.js";

export const getDashboardData = async (req, res) => {
  try {
    // Get all bookings with populated data
    const bookings = await Booking.find()
      .populate('user', 'username email image')
      .populate('tour', 'name location images price time guest')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Calculate stats
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ isPaid: true });
    const unpaidBookings = await Booking.countDocuments({ isPaid: false });
    
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Calculate revenue
    const paidBookingsList = await Booking.find({ isPaid: true }).lean();
    const totalRevenue = paidBookingsList.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalGuests = bookings.reduce((sum, b) => sum + (b.numberOfGuests || 0), 0);
    const avgBookingValue = paidBookingsList.length > 0 
      ? Math.round(totalRevenue / paidBookingsList.length) 
      : 0;

    // Tour stats
    const totalTours = await Tour.countDocuments();
    const availableTours = await Tour.countDocuments({ isActive: true });

    // Top tours (most booked)
    const topToursData = await Booking.aggregate([
      { $match: { tour: { $exists: true } } },
      {
        $group: {
          _id: '$tour',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          totalGuests: { $sum: '$numberOfGuests' }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 }
    ]);

    // Populate tour info
    const topTours = await Promise.all(
      topToursData.map(async (item) => {
        const tour = await Tour.findById(item._id).select('name location images').lean();
        return {
          tourInfo: tour || { name: 'N/A', location: 'N/A' },
          bookingCount: item.bookingCount,
          totalRevenue: item.totalRevenue,
          totalGuests: item.totalGuests
        };
      })
    );

    // Recent users
    const recentUsers = await User.find()
      .select('username email image createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
        stats: {
          paidBookings,
          unpaidBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          completedBookings,
          totalTours,
          availableTours,
          totalGuests,
          avgBookingValue
        },
        topTours,
        recentUsers
      }
    });

  } catch (error) {
    console.error('getDashboardData error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy dữ liệu dashboard',
      error: error.message
    });
  }
};

// ✅ UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;

    if (typeof isPaid !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isPaid phải là boolean (true/false)'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        isPaid,
        paidAt: isPaid ? new Date() : null,
        status: isPaid ? 'confirmed' : 'pending'
      },
      { new: true }
    ).populate('tour', 'name')
      .populate('user', 'username email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    res.json({
      success: true,
      message: `Đã cập nhật trạng thái thanh toán`,
      data: booking
    });

  } catch (error) {
    console.error('updatePaymentStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật payment status',
      error: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách users',
      error: error.message
    });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '', isPaid = '' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (isPaid !== '') query.isPaid = isPaid === 'true';

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('tour', 'name location price')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('getAllBookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách bookings',
      error: error.message
    });
  }
};


export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, status = '' } = req.query;
    
    const offset = (page - 1) * limit;

    let transactions;
    if (status) {
      transactions = await TransactionService.getByStatus(status, limit);
    } else {
      transactions = await TransactionService.getAll(limit, offset);
    }

    // Get total count
    const countQuery = status 
      ? `SELECT COUNT(*) FROM transactions WHERE status = $1`
      : `SELECT COUNT(*) FROM transactions`;
    
    const countParams = status ? [status] : [];
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total: total
    });

  } catch (error) {
    console.error('getAllTransactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách transactions',
      error: error.message
    });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    // Booking stats
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Revenue stats
    const paidBookings = await Booking.find({ isPaid: true }).lean();
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    const thisMonthPaidBookings = await Booking.find({ 
      isPaid: true,
      paidAt: { $gte: new Date(new Date().setDate(1)) }
    }).lean();
    const thisMonthRevenue = thisMonthPaidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Transaction stats (from PostgreSQL)
    const transactionStats = await TransactionService.getStatistics();

    // Tour stats
    const totalTours = await Tour.countDocuments();
    const activeTours = await Tour.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings
        },
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue
        },
        transactions: transactionStats,
        tours: {
          total: totalTours,
          active: activeTours
        }
      }
    });

  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thống kê',
      error: error.message
    });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status không hợp lệ'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('tour', 'name')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    res.json({
      success: true,
      message: `Đã cập nhật status thành ${status}`,
      data: booking
    });

  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật booking',
      error: error.message
    });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa user thành công'
    });

  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa user',
      error: error.message
    });
  }
};


export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('tour', 'name location images price time guest')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking không tồn tại'
      });
    }

    // Get transaction info
    const transaction = await TransactionService.getByBookingId(id);

    res.json({
      success: true,
      data: {
        ...booking,
        transaction
      }
    });

  } catch (error) {
    console.error('getBookingDetails error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết booking',
      error: error.message
    });
  }
};


export const getRevenueByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu startDate hoặc endDate'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      isPaid: true,
      paidAt: { $gte: start, $lte: end }
    }).populate('tour', 'name')
      .lean();

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookings = bookings.length;

    // Get transactions in same period
    const transactions = await TransactionService.getByDateRange(start, end);
    const successfulTransactions = transactions.filter(t => t.status === 'success');

    res.json({
      success: true,
      data: {
        startDate: start,
        endDate: end,
        totalRevenue,
        totalBookings,
        totalTransactions: transactions.length,
        successfulTransactions: successfulTransactions.length,
        bookings: bookings.map(b => ({
          id: b._id,
          tourName: b.tour?.name,
          amount: b.totalPrice,
          paidAt: b.paidAt,
          numberOfGuests: b.numberOfGuests
        }))
      }
    });

  } catch (error) {
    console.error('getRevenueByDateRange error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy doanh thu',
      error: error.message
    });
  }
};

