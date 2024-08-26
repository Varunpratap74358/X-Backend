import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRouter from './routes/authRoute.js'
import userRoutes from './routes/userRoutes.js'
import postRoute from './routes/postRoute.js'
import notificationRoute from './routes/notificationRoute.js'

import {v2 as cloudinary} from 'cloudinary'

const app = express()
dotenv.config()

// cloudinay setup
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});




const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin:true,
    methods:['GEt','PUT','POST','DELETE'],
    credentials:true
}))

// middleware
app.use("/api/auth",authRouter)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoute)
app.use("/api/notification",notificationRoute)

mongoose.connect(process.env.MONGOURL)
.then(()=>{
    console.log("DB is connected");
})
.catch((err)=>{
    console.log(err);
})


app.listen(port,()=>{
    console.log(`Server is runing on ${port}`);
    
})