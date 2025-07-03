import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const createTokenAndSaveCookies = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY,{
        expiresIn: "4d"
    })
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    await User.findByIdAndUpdate(userId, {token});
    return token
}

export default createTokenAndSaveCookies; 