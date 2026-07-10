import express from "express";
import { createOrder, getSingleOrder, allMyOrders , getAllOrders, updateOrderStatus, deleteOrder} from "../controllers/orderController.js";
import { roleBasedAccess, verifyUserAuthentication } from "../middlewares/userAuth.js";

const router = express.Router();

// User
router.post("/new/order", verifyUserAuthentication, createOrder);
router.get("/my/orders", verifyUserAuthentication, allMyOrders);
router.get("/order/:id", verifyUserAuthentication, getSingleOrder);

// Admin
router.get("/admin/orders", verifyUserAuthentication, roleBasedAccess("admin"), getAllOrders);
router.put("/admin/order/:id", verifyUserAuthentication,roleBasedAccess("admin"), updateOrderStatus);
router.delete("/admin/order/:id", deleteOrder);

export default router;
