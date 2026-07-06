import dotenv from "dotenv";
dotenv.config({ path: "./backend/config/config.env" });

import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import "./config/cloudinaryConfig.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";



// Initialize App
const app = express();
const PORT = process.env.PORT || 8001;

// global middle
app.use(express.json());
app.use(cookieParser());

// connect to database
connectDB ();

// Routing
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/payments", paymentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
