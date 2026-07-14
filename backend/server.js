import dotenv from "dotenv";
dotenv.config({ path: "./backend/config/config.env" });

import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import cors from 'cors';
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import "./config/cloudinaryConfig.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 8001;

// Explicitly list the exact domains allowed to connect to your API
const allowedOrigins = [
  "https://vercel.app",  
  "http://localhost:5173"            
];

//  Configure safe, secure CORS rules
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Request blocked by CORS security validation"));
    }
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// global middleware
app.use(express.json());
app.use(cookieParser());

// connect to database
connectDB();

// Routing
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/payments", paymentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
