// import User from "../models/user.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import sendMail, { sendForgotMail } from "../middleware/sendMail.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import dotenv from 'dotenv';
dotenv.config();
import admin from "../middleware/FirebaseAdmin.js";

// Utility to create JWT token and save in HttpOnly cookie
const createTokenAndSaveCookies = (userId, res) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
  return token;
};

export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Please upload a profile photo" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const { email, password, name, phone, education, role } = req.body;
    if (!email || !password || !name || !phone || !education || !role) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload photo to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return res.status(500).json({ message: "Error uploading photo" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user but do NOT save yet. Add OTP verification (optional)
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

    // Send OTP email
    await sendMail(email, "Blog - OTP Verification", { name, otp });

    // Create activation token with user info + otp
    const activationToken = jwt.sign(
      {
        user: {
          name,
          email,
          phone,
          education,
          role,
          password: hashedPassword,
          photo: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          },
        },
        otp,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );

    return res.status(200).json({
      message: "OTP sent to your email, please verify",
      activationToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken
    } = req.body;

   
    if (!otp || !activationToken) {
      return res.status(400).json({ message: "OTP and token required" });
    }

    const decoded = jwt.verify(activationToken, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.user || !decoded.user.email) {
      return res.status(400).json({ message: "Activation token is invalid or expired" });
    }


    if (decoded.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save user to DB
    const existingUser = await User.findOne({ email: decoded.user.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const newUser = new User(decoded.user);
    await newUser.save();

    // Automatically log in user after verification
    const token = createTokenAndSaveCookies(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        photo: newUser.photo,
      },
      token,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Activation token expired" });
    }
    return res.status(500).json({ message: "Error verifying user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("User:   -> ", user);


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked by admin" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Role '${role}' not authorized` });
    }

    const token = createTokenAndSaveCookies(user._id, res);

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        education: user.education,
        phone: user.phone
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;;
    await user.save();

    await sendForgotMail("Blog Password Reset OTP", { email, otp });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in forgot password" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    if (!user.resetPasswordExpire || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (Number(user.resetPasswordOtp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    // req.user should be populated by auth middleware after JWT verification
    const user = await User.findById(req.user._id);
    console.log("user profile: ", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, education } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (education) user.education = education;

    // ✅ Check for photo file
    if (req.files && req.files.photo) {
      const photo = req.files.photo;

      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({ message: "Invalid image format" });
      }

      // ❌ Optional: delete old image from Cloudinary
      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id);
      }

      // ✅ Upload new image
      const result = await cloudinary.uploader.upload(photo.tempFilePath);

      user.photo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      updatedUser: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { email, name, picture, uid: googleId } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        phone: "0000000000",   // Dummy, required hai
        education: "N/A",      // Dummy, required hai
        photo: {
          public_id: "google",
          url: picture,
        },
        password: "googleUser",  // Dummy password
        role: "user",
      });
    }

    const authToken = createTokenAndSaveCookies(user._id, res);

    res.status(200).json({
      message: `Welcome ${user.name}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token: authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 导出一个异步函数，用于阻止用户
export const blockUser = async (req, res) => {
  try {
    // 获取请求参数中的用户ID
    const userId = req.params.id;
    // 根据用户ID查找用户
    const userToBlock = await User.findById(userId);

    // 如果找不到用户，返回404状态码和错误信息
    if (!userToBlock) {
      return res.status(404).json({ message: "User not found" });
    }

    // 切换用户的阻止状态
    userToBlock.isBlocked = !userToBlock.isBlocked; // Toggle
    // 保存用户信息
    await userToBlock.save();

    // 返回200状态码和成功信息
    res.status(200).json({
      success: true,
      message: `User ${userToBlock.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
    });
  } catch (error) {
    // 如果发生错误，打印错误信息，并返回500状态码和错误信息
    console.error("Block User Error:", error);
    res.status(500).json({ message: "Error blocking user" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // exclude password if needed
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};