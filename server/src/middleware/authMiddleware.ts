import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

    // Verify user exists
    const user = await User.findById(decoded.id).select("-passwordHash -refreshTokenHash");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
