import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: [1, 'Số khách phải lớn hơn 0']
    },
    bookingDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Tổng giá phải lớn hơn hoặc bằng 0']
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    contactInfo: {
        name: {
            type: String,
            required: [true, 'Tên người đặt là bắt buộc'],
            trim: true,
            minlength: [3, 'Tên phải có ít nhất 3 ký tự'],
            maxlength: [100, 'Tên không được quá 100 ký tự']
        },
        phone: {
            type: String,
            required: [true, 'Số điện thoại là bắt buộc'],
            trim: true,
            validate: {
                validator: function(v) {
                    return /^(84|0[3|5|7|8|9])+([0-9]{8})$/.test(v.replace(/\s/g, ''));
                },
                message: 'Số điện thoại không hợp lệ'
            }
        },
        cccd: {
            type: String,
            required: [true, 'Số CCCD/CMND là bắt buộc'],
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[0-9]{9}$|^[0-9]{12}$/.test(v.replace(/\s/g, ''));
                },
                message: 'CCCD phải là 9 hoặc 12 số'
            }
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    if (!v) return true; // Email không bắt buộc
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Email không hợp lệ'
            }
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [500, 'Ghi chú không được quá 500 ký tự']
        }
    }
}, { 
    timestamps: true 
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ tour: 1, bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'contactInfo.phone': 1 });
bookingSchema.index({ 'contactInfo.cccd': 1 });

// Virtual để format phone number
bookingSchema.virtual('contactInfo.formattedPhone').get(function() {
    if (!this.contactInfo.phone) return '';
    const phone = this.contactInfo.phone.replace(/\s/g, '');
    if (phone.startsWith('84')) {
        return `+${phone}`;
    }
    return phone;
});

bookingSchema.pre('save', function(next) {
    if (this.contactInfo) {
        if (this.contactInfo.phone) {
            this.contactInfo.phone = this.contactInfo.phone.replace(/\s/g, '');
        }
        if (this.contactInfo.cccd) {
            this.contactInfo.cccd = this.contactInfo.cccd.replace(/\s/g, '');
        }
        if (this.contactInfo.name) {
            this.contactInfo.name = this.contactInfo.name.trim();
        }
        if (this.contactInfo.notes) {
            this.contactInfo.notes = this.contactInfo.notes.trim();
        }
    }
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
