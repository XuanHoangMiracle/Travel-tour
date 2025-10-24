// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getUserData, 
    getRecentSearchedCities, 
    saveSearchedCities 
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/", protect, getUserData);
userRoute.get('/searched-cities', protect, getRecentSearchedCities);
userRoute.post('/searched-cities', protect, saveSearchedCities);


export default userRoute;
