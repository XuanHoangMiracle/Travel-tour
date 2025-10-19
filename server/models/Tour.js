
import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true},
  location: { type: String, required: true },
  images: [{ type:String}],     
  guest: { type: Number, required: true, min: 1 },
  schedule: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  time: { type: String, required: true },          
  service: [{type: String}],
  comment:{type: Array, default: []}        
}, { timestamps: true });

// Virtual populate: 1 tour → nhiều comment
tourSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tour",
});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
