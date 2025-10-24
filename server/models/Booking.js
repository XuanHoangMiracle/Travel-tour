import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        min: 1
    },
    bookingDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    contactInfo: {
        name: String,
        email: String,
        phone: String
    }
}, { 
    timestamps: true 
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
