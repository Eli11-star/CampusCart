import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    console.log("===== AUTH =====");
    console.log("Authorization:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("NO HEADER");
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
    
  } catch (err) {
    console.log("JWT ERROR:", err);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;