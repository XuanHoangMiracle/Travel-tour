
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
  comment:{type: Array, default: []}  ,
  averageRating: { type: Number, default: 5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 } ,
  embedding: {
    type: [Number], 
    required: false
  }    
}, { timestamps: true });


tourSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tour",
});
// Middleware tự động tạo locationLowercase
tourSchema.pre('save', function(next) {
  if (this.location) {
    this.locationLowercase = this.location.toLowerCase();
  }
  next();
});

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;
