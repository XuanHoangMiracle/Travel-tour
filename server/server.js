import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB()

const app = express()
app.use(cors()) //Kết nối fontend
//Middelware
app.use(express.json())
app.use(clerkMiddleware()) //clerk

//API clerck
app.use("/api/clerk",clerkWebhooks)

app.get('/',(req, res)=> res.send("API hoạt động"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));