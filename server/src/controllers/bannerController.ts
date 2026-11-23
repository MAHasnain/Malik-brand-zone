import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { isObjectIdOrHexString } from "mongoose";
import { HeroBanner } from "../models/banner.model";
import { deleteFromCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const listBanners = asyncHandler(
 async (_req: Request, res: Response) => {
  const banners = await HeroBanner.find({})
   .select("_id imageUrl")
   .sort({ createdAt: -1, _id: -1 })
   .lean();
  res.set("Cache-Control", "no-store").json(new ApiResponse(200, banners));
 },
);

export const publishBanner = asyncHandler(
 async (req: Request, res: Response) => {
  const file = req.file;
  if (
   !file?.size ||
   !["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
  ) {
   throw new ApiError(400, "Choose a JPG, PNG or WebP image.");
  }
  if (file.size > 4 * 1024 * 1024)
   throw new ApiError(413, "Maximum image size is 4 MB.");

  const asset = await new Promise<{ imageUrl: string; publicId: string }>(
   (resolve, reject) => {
    cloudinary.uploader
     .upload_stream(
      {
       folder: "MBZ/banners",
       resource_type: "image",
       allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
       if (error || !result)
        return reject(new ApiError(502, "Banner upload failed."));
       resolve({ imageUrl: result.secure_url, publicId: result.public_id });
      },
     )
     .end(file.buffer);
   },
  );

  let banner;
  try {
   banner = await HeroBanner.create(asset);
  } catch (error) {
   await deleteFromCloudinary(asset.publicId);
   throw error;
  }
  res
   .status(201)
   .json(
    new ApiResponse(
     201,
     { _id: banner._id, imageUrl: banner.imageUrl },
     "Banner published",
    ),
   );
 },
);

export const removeBanner = asyncHandler(
 async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!isObjectIdOrHexString(id)) throw new ApiError(400, "Invalid banner ID.");
  const banner = await HeroBanner.findById(id).select("+publicId");
  if (banner) {
   const result = await cloudinary.uploader.destroy(banner.publicId, {
    invalidate: true,
   });
   if (result.result !== "ok" && result.result !== "not found") {
    throw new ApiError(502, "Could not remove the image. Please retry.");
   }
   await HeroBanner.deleteOne({ _id: banner._id });
  }
  res.sendStatus(204);
 },
);
