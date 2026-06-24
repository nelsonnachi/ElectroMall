import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  getUserProfile,
  updateProfile,
  updatePassword,
  getUsersList,
  getSingleUser,
  updateUserRole,
  deleteUser
} from "../controllers/userController.js";
import { roleBasedAccess, verifyUserAuthentication } from "../middlewares/userAuth.js";
import { uploadSingleImage } from "../middlewares/multerUpload.js";

const router = express.Router();

// User auth paths (Resolves to /api/v1/...)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/password/forgot", requestPasswordReset);
router.post("/password/reset/:token", resetPassword);
router.get("/profile", verifyUserAuthentication, getUserProfile);
router.put("/profile/update", verifyUserAuthentication, uploadSingleImage.single("avatar") ,updateProfile);
router.put("/password/update", verifyUserAuthentication, updatePassword);

// admin-------------------------

router.get("/admin/users",verifyUserAuthentication, roleBasedAccess("admin"), getUsersList);
router.get("/admin/user/:id",verifyUserAuthentication, roleBasedAccess("admin"), getSingleUser  );
router.put("/admin/user/:id",verifyUserAuthentication, roleBasedAccess("admin"), updateUserRole );
router.delete("/admin/user/:id",verifyUserAuthentication, roleBasedAccess("admin"), deleteUser );


export default router;
