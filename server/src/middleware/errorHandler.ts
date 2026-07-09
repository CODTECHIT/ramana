import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the full error and stack trace to the server console (for debugging and monitoring)
  console.error("🔥 [Global Error Handler] Error caught:");
  console.error(err);

  // Send a sanitized, generic error message to the client to prevent leaking sensitive info
  const statusCode = err.statusCode || 500;
  
  // In development, you might want to send the stack trace, but the prompt strictly asks to never expose it in production.
  // We will enforce generic messages for 500 errors to avoid exposing internal logic.
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }) // Optional: send stack trace only if not in production
  });
};
