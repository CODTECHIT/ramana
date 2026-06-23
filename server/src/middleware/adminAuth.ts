import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

    // We verify against the DB to ensure they still have admin rights
    // and weren't demoted or deleted since the token was issued.
    const user = await User.findById(decoded.id).select("role");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden, requires admin role" });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
