import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import logger from "../logger/winston.logger";
import {
 generateAccessToken,
 generateRefreshToken,
 AuthTokenPayload,
} from "../utils/token.utils";

// Cookie Options Setup
const cookieOptions = {
 httpOnly: true,
 secure: process.env.NODE_ENV === "production",
 sameSite:
  process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
};

export const login = asyncHandler(async (req: Request, res: Response) => {
 const { email, password } = req.body;

 if (!email || !password) {
  throw new ApiError(400, "Email and password are required");
 }

 // Fetch admin with explicit password inclusion
 const admin = await Admin.findOne({ email }).select("+password_hash");

 if (!admin) {
  throw new ApiError(404, "Admin account not found");
 }

 if (!admin.isActive) {
  throw new ApiError(403, "Your admin account is disabled.");
 }

 const isPasswordValid = await admin.comparePassword(password);
 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid Credentials");
 }

 const tokenPayload: AuthTokenPayload = {
  id: admin._id.toString(),
  email: admin.email,
 };

 const accessToken = generateAccessToken(tokenPayload);
 const refreshToken = generateRefreshToken(tokenPayload);

 // Save Refresh Token in Database for Session Validation
 admin.refreshToken = refreshToken;
 await admin.save({ validateBeforeSave: false });

 logger.info(`Admin Logged In: ${admin.email} | IP: ${req.ip}`);

 const adminResponseData = {
  id: admin._id,
  name: admin.name,
  email: admin.email,
  isActive: admin.isActive,
 };

 return res
  .status(200)
  .cookie("accessToken", accessToken, {
   ...cookieOptions,
   maxAge: 15 * 60 * 1000, // 15 Minutes
  })
  .cookie("refreshToken", refreshToken, {
   ...cookieOptions,
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  })
  .json(
   new ApiResponse(
    200,
    { admin: adminResponseData, accessToken, refreshToken },
    "Login Successful",
   ),
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
 const refreshToken = req.cookies?.refreshToken;

 if (refreshToken) {
  // Invalidate Refresh Token in Database
  await Admin.findOneAndUpdate(
   { refreshToken },
   { $unset: { refreshToken: 1 } },
   { new: true },
  );
 }

 return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(new ApiResponse(200, {}, "Logout successful"));
});

export const refreshAccessToken = asyncHandler(
 async (req: Request, res: Response) => {
  const incomingRefreshToken =
   req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
   throw new ApiError(401, "Unauthorized request. Refresh token missing.");
  }

  let decoded: AuthTokenPayload;
  try {
   decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET || "refresh_secret",
   ) as AuthTokenPayload;
  } catch (error) {
   throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const admin = await Admin.findById(decoded.id);

  if (!admin) {
   throw new ApiError(404, "Admin not found");
  }

  // Cross check with DB saved token (Security Check for revoked sessions)
  if (admin.refreshToken !== incomingRefreshToken) {
   throw new ApiError(401, "Refresh token is expired or has been reused.");
  }

  if (!admin.isActive) {
   throw new ApiError(403, "Admin account is inactive.");
  }

  const tokenPayload: AuthTokenPayload = {
   id: admin._id.toString(),
   email: admin.email,
  };

  const newAccessToken = generateAccessToken(tokenPayload);

  return res
   .status(200)
   .cookie("accessToken", newAccessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
   })
   .json(
    new ApiResponse(
     200,
     { accessToken: newAccessToken },
     "Access token refreshed successfully",
    ),
   );
 },
);
