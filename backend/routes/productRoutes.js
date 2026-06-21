import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAdminProducts,
  createReviewForProduct,
  getProductReview,
  deleteReview
} from "../controllers/productController.js";
import { roleBasedAccess, verifyUserAuthentication } from "../middlewares/userAuth.js";

const router = express.Router();

// Public / Authenticated Customer Routes
// router.get("/products", verifyUserAuthentication, getAllProducts);
// router.get("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), getSingleProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);

// Admin Routes 
router.post("/admin/product/create", verifyUserAuthentication, roleBasedAccess("admin"), createProduct);
router.get("/admin/products", verifyUserAuthentication, roleBasedAccess("admin"), getAdminProducts);
router.get("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), getSingleProduct);
router.put("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), updateProduct);
router.delete("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), deleteProduct);

// Reviews
router.put("/review", verifyUserAuthentication, createReviewForProduct);
router.get("/reviews", getProductReview);
router.delete("/reviews", verifyUserAuthentication, deleteReview);


export default router;
