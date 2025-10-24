// middleware/authMiddleware.js
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth?.();  
    const userId = auth?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Tìm user trong Mongo
    let user = await User.findById(userId);

    // Nếu chưa có → tạo mới từ dữ liệu Clerk
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      // Lấy email chính (nếu có)
      const primaryEmail =
        clerkUser?.emailAddresses?.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
        clerkUser?.emailAddresses?.[0]?.emailAddress ||
        "unknown@example.com";

      user = await User.create({
        _id: userId,
        username: clerkUser?.username || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "User",
        email: primaryEmail,
        image: clerkUser?.imageUrl || "",
        role: "user",
        recentSearchedCities: [],  // mảng trống ban đầu
      });
    }

    // gắn vào req cho controller
    req.user = user;
    next();
  } catch (err) {
    console.error("[protect] error:", err);
    return res.status(500).json({ success: false, message: "Auth middleware failed", error: err.message });
  }
};
