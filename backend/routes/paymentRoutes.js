import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { verifyUserAuthentication } from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/verify/:reference/:orderId", verifyUserAuthentication, verifyPayment);

export default router;
