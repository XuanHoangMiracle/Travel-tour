import Tour from "../models/Tour.js";
import { v2 as cloudinary } from "cloudinary";

//Tạo tour
export const createTour = async (req, res) => {
  try {
    const { name, location, price, guest, schedule, time, service } = req.body;
    // Upload ảnh lên Cloudinary
    const uploadImages = req.files.map(async (file) => {
        const response = await cloudinary.uploader.upload(file.path);
        return response.secure_url;
    });
    const images = await Promise.all(uploadImages);
    await Tour.create({
      name,
      location,
      images,
      guest,
      schedule,
      price,
      time,
      service
    });
    res.json({success:true,message:"Tạo tour thành công"})

  } catch (error) {
    res.status(500).json({success:false,message:"Tạo tour thất bại",error:error.message});
  }
}    

//lấy tour
export const getTour = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: tours });
  } catch (error) {
    console.error("getTour error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//Số lượng khách
export const quantityGuest = async (req, res) => {
  try {
    const { id } = req.params;
    let { action, delta, guest } = req.body;

    if (guest !== undefined) {
      const target = Number(guest);
      if (!Number.isFinite(target) || target < 1) {
        return res.status(400).json({ success: false, message: "guest must be a number >= 1" });
      }
      const updated = await Tour.findOneAndUpdate(
        { _id: id },
        { $set: { guest: target } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: "Tour not found" });
      return res.json({ success: true, message: "Updated guest (set)", data: updated });
    }

    action = (action || "").toLowerCase();
    delta = Number(delta ?? 1);
    if (!["inc", "dec"].includes(action) || !Number.isFinite(delta) || delta < 1) {
      return res.status(400).json({
        success: false,
        message: 'Provide { action: "inc" | "dec", delta: number >= 1 } or { guest: number >= 1 }',
      });
    }

    if (action === "inc") {
      const updated = await Tour.findOneAndUpdate(
        { _id: id },
        { $inc: { guest: delta } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: "Tour not found" });
      return res.json({ success: true, message: `Increased guest by ${delta}`, data: updated });
    } else {
      const updated = await Tour.findOneAndUpdate(
        { _id: id, guest: { $gte: delta + 1 } },
        { $inc: { guest: -delta } },
        { new: true }
      );
      if (!updated) {
        const exists = await Tour.exists({ _id: id });
        if (!exists) return res.status(404).json({ success: false, message: "Tour not found" });
        return res.status(400).json({
          success: false,
          message: `Cannot decrease by ${delta}: guest cannot drop below 1`,
        });
      }
      return res.json({ success: true, message: `Decreased guest by ${delta}`, data: updated });
    }
  } catch (error) {
    console.error("quantityGuest error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};