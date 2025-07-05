import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication
// export const isAuthenticated = async (req, res, next) => {
//     try{
//         const token = req.cookies.jwt;
//         console.log("Middleware Token: "+token);
//         if(!token){
//             console.log("No token found");
//            return res.status(401).json({message: "User is not Authenticated"});
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         console.log("decoded: ",decoded);
//         console.log("decoded userid: ",decoded._id);

//         const user = await User.findById(decoded._id);
//         if(!user){
//             console.log("User not found", user);
//             return res.status(404).json({message: "User is not found"});
//         }

//         if (user.isBlocked) {
//             return res.status(403).json({ message: "You are blocked by admin" });
//           }

//         req.user = user;
//         next();
//     }catch(err){
//         console.log("Authentication failed: "+err);
//         return res.status(401).json({message: "User is not Authenticated"});
//     }
// }

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Blocked by admin" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// middleware/auth.js
export const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Authorization (the user is admin or not)
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User with given role ${req.user.role} not allowed` });
    }
    next();
  }
}