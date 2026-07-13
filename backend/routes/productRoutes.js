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
import { upload } from "../middlewares/multerUpload.js";

const router = express.Router();

router.post("/admin/product/create", verifyUserAuthentication, roleBasedAccess("admin"), upload.array("images", 5), createProduct);
router.get("/products", getAllProducts);
router.put("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"),upload.array("images", 5), updateProduct);
router.delete("/admin/product/:id", verifyUserAuthentication, roleBasedAccess("admin"), deleteProduct);
router.get("/product/:id", getSingleProduct);
router.get("/admin/products", verifyUserAuthentication, roleBasedAccess("admin"), getAdminProducts);
router.put("/review", verifyUserAuthentication, createReviewForProduct);
router.get("/reviews", getProductReview);
router.delete("/reviews", verifyUserAuthentication, deleteReview);

export default router;
