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
  deleteReview,
} from "../controllers/productController.js";
import { verifyUserAuthentication, roleBasedAccess } from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/product/new", verifyUserAuthentication, roleBasedAccess("admin"), createProduct);
router.get("/products", getAllProducts);
router.put("/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), updateProduct);
router.delete("/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), deleteProduct);
router.get("/product/:id", getSingleProduct);
router.get("/admin/products", verifyUserAuthentication, roleBasedAccess("admin"), getAdminProducts);
router.put("/review", verifyUserAuthentication, createReviewForProduct);
router.get("/reviews", getProductReview);
router.delete("/reviews", verifyUserAuthentication, deleteReview);

export default router;
