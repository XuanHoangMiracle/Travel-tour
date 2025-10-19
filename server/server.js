import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import commentRouter from './routes/commentRoutes.js';

connectDB()
connectCloudinary();

const app = express()
app.use(cors()) //Kết nối fontend
//Middelware
app.use(clerkMiddleware());
app.use(express.json())

//API clerck
app.use("/api/clerk", clerkWebhooks);


app.get('/',(req, res)=> res.send("API hoạt động tốt"))
app.use('/api/user',userRouter)
app.use('/api/tours',tourRouter)
app.use("/api/comments", commentRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));