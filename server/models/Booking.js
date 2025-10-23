
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
   user: {type: String,ref: "User", required: true},
   tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
   bookingDate: { type: String, required: true, index: true },
   quantity: { type: Number, required: true, min: 1 },
   totalPrice: {type: Number, required: true, min: 0},
   status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
   paymentMethod: {type: String, enum: ["credit_card", "paypal"], required: true},
   isPaid: {type: Boolean, default: false},   
}, { timestamps: true });

bookingSchema.index({ tour: 1, bookingDate: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
