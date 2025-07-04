import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors  from "cors";
const app = express();
dotenv.config();
console.log("PORT:", process.env.PORT);
console.log("SMTP_HOST:", process.env.SMTP_HOST);
const port = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
// console.log(MONGO_URI);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
const allowedOrigins = [
    'http://localhost:5173',
    'https://blogging-app-frontend-vobi.onrender.com'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));


// DB Code 
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));


// defining routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);


// CLOUDINARY CONFIG
 // Configuration
//  yunavglawevshnii
 cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY 
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})