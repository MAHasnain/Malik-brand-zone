import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { Admin, IAdmin } from "../models/admin.model";
import { AuthTokenPayload } from "../utils/token.utils";

declare global {
 namespace Express {
  interface Request {
   admin?: IAdmin;
  }
 }
}
export const protectAdmin = asyncHandler(
 async (req: Request, res: Response, next: NextFunction) => {
  let token =
   req.cookies?.accessToken ||
   req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
   throw new ApiError(401, "Not authorized. Access token missing.");
  }

  try {
   const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "access_secret",
   ) as AuthTokenPayload;
   const admin = await Admin.findById(decoded.id);

   if (!admin || !admin.isActive) {
    throw new ApiError(401, "Invalid session or inactive admin account.");
   }

   req.admin = admin;
   next();
  } catch (error) {
   throw new ApiError(401, "Access token expired or invalid.");
  }
 },
);
