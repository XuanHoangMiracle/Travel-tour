import mongoose from "mongoose";

const tourAvailabilitySchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  maxGuests: {
    type: Number,
    required: true
  },
  bookedGuests: {
    type: Number,
    default: 0
  },
  availableSlots: {
    type: Number,
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  status: {
    type: String,
    enum: ['available', 'limited', 'full'],
    default: 'available'
  }
}, { timestamps: true });

// Index để query nhanh
tourAvailabilitySchema.index({ tour: 1, date: 1 }, { unique: true });
tourAvailabilitySchema.index({ date: 1 });
tourAvailabilitySchema.index({ status: 1 });

// Virtual để tính % còn trống
tourAvailabilitySchema.virtual('occupancyRate').get(function() {
  return (this.bookedGuests / this.maxGuests * 100).toFixed(2);
});

// Middleware tự động update status
tourAvailabilitySchema.pre('save', function(next) {
  this.availableSlots = this.maxGuests - this.bookedGuests;
  
  if (this.availableSlots === 0) {
    this.status = 'full';
  } else if (this.availableSlots <= this.maxGuests * 0.3) {
    this.status = 'limited';
  } else {
    this.status = 'available';
  }
  
  next();
});

const TourAvailability = mongoose.model("TourAvailability", tourAvailabilitySchema);
export default TourAvailability;
