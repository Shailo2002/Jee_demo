import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "No authentication token, access denied" });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Token is invalid or expired" });
  }
};

export default authenticate;
