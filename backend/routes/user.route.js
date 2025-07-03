import express from "express";
import multer from "multer";
import upload from "../middleware/upload.js";
import {
  register,
  login,
  logout,
  getMyProfile,
  getAdmins,
  verifyUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  googleLogin,
  blockUser,
  unblockUser,
  getAllUsers
} from "../controller/user.controller.js";

import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

// Protected routes - user must be logged in
router.get("/logout", isAuthenticated, logout);
router.get("/my-profile", isAuthenticated, getMyProfile);

// Only admin can access this

router.get("/admins", isAuthenticated,  getAdmins);

router.post("/verify-user", verifyUser);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.put("/update-profile", isAuthenticated , updateProfile);
router.put('/:id/block', isAuthenticated, isAdmin("admin"), blockUser);
router.put("/:id/unblock", isAuthenticated, isAdmin("admin"), unblockUser);
router.get('/all', isAuthenticated, isAdmin("admin"), getAllUsers);



export default router;
