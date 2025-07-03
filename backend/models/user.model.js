import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: Number,
    required: false, // ⛳ changed
    unique: true,
    default: 0,
  },
  photo: {
    public_id: {
      type: String,
      required: false, // ⛳ changed
      default: "default", // ⛳ for google user
    },
    url: {
      type: String,
      required: false, // ⛳ changed
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  education: {
    type: String,
    required: true,
    required: false, // ⛳ changed
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    required: false, // ⛳ changed for google login
    select: false,
    minlength: 8,
  },
  token: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const User = mongoose.model("User", userSchema);