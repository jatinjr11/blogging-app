import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "4d"
    })
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // ❗ very important for HTTPS (Render)
        sameSite: "None", // ❗ required for cross-site cookies
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    await User.findByIdAndUpdate(userId, { token });
    return token
}

export default createTokenAndSaveCookies; 