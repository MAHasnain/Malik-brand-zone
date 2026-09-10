import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
 name: string;
 slug: string;
 imageURL?: string;
 isActive: boolean;
 createdAt: Date;
 updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
 {
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  imageURL: { type: String },
  isActive: { type: Boolean, default: true },
 },
 { timestamps: true },
);

export const Category = model<ICategory>("Category", CategorySchema);
