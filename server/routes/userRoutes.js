// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, getRecentSearchedCities } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/", protect, getUserData);
userRoute.post("/recent-search-locations", protect, getRecentSearchedCities);

export default userRoute;
