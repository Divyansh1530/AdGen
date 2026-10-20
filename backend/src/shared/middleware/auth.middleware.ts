import type{ Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
   
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]

    if (!token) {
      res.status(401).json({
        success:false,
        message:"Access token is required"
      })
      return
    }


    const payload = verifyAccessToken(token!);

    
    req.userId = payload.userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};