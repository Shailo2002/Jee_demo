import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Add user from payload
    req.user = {
      id: decoded.userId
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth; 