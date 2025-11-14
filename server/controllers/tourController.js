import Tour from "../models/Tour.js";
import { v2 as cloudinary } from "cloudinary";

//Tạo tour
export const createTour = async (req, res) => {
  try {
    const { name, location, price, guest, schedule, time, service } = req.body;

    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });
    const images = await Promise.all(uploadImages);
    
    await Tour.create({ 
      name, 
      location, 
      images, 
      guest: Number(guest), 
      schedule, 
      price: Number(price), 
      time, 
      service,
      embedding: []
    });
    
    res.json({success:true, message:"Tạo tour thành công"})
  } catch (error) {
    res.status(500).json({success:false, message:"Tạo tour thất bại", error:error.message});
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
// ✅ Cập nhật tour
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, guest, price, time, schedule } = req.body;

        const tour = await Tour.findByIdAndUpdate(
            id,
            { name, location, guest, price, time, schedule },
            { new: true, runValidators: true }
        );

        if (!tour) {
            return res.status(404).json({ success: false, message: 'Tour không tồn tại' });
        }

        res.json({ success: true, message: 'Cập nhật tour thành công', data: tour });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật tour', error: error.message });
    }
};
//Khả dụng của tour
export const toggleTourAvailability = async (req, res) => {
  try {
    const { tourID } = req.body;
    const tourData = await Tour.findById(tourID);
    tourData.isAvailable = !tourData.isAvailable;
    await tourData.save();
    res.json({ success: true, message: "Cập nhật trạng thái tour thành công", data: tourData });
  } catch (error) {
    res.status(500).json({success:false,message:"Cập nhật trạng thái tour thất bại",error:error.message});
  }
};
export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id).lean();
    
    if (!tour) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tour không tồn tại' 
      });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    console.error('getTourById error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lấy thông tin tour',
      error: error.message 
    });
  }
};
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tour = await Tour.findByIdAndDelete(id);
        
        if (!tour) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tour không tồn tại' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Xóa tour thành công' 
        });
    } catch (error) {
        console.error('deleteTour error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi xóa tour',
            error: error.message 
        });
    }
};