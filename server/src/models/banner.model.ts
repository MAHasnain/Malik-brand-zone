import { model, Schema } from "mongoose";

const bannerSchema = new Schema({
  slot: { type: Number, min: 0, max: 3 },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true, select: false },
}, { timestamps: true });

bannerSchema.index({ slot: 1 }, { unique: true, sparse: true });

export const HeroBanner = model("HeroBanner", bannerSchema);
