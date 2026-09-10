import { Schema, model, Document, models } from "mongoose";

export interface IProduct extends Document {
 title: string;
 slug: string;
 description: string;
 price: number;
 discountPrice?: number;
 category: Schema.Types.ObjectId;
 fabric: string;
 sizes: string[];
 colors: string[];
 images: string[];
 stock: number;
 isFeatured: boolean;
 createdAt: Date;
 updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
 {
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  fabric: { type: String, default: "" },
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  images: { type: [String], required: true },
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
 },
 { timestamps: true },
);

// Indexes for fast filtering and searching
ProductSchema.index({ category: 1, stock: 1, price: 1, fabric: 1 });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
