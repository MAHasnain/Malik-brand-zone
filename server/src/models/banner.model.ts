import { model, Schema } from "mongoose";

const bannerSchema = new Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true, select: false },
}, { timestamps: true });

export const HeroBanner = model("HeroBanner", bannerSchema);