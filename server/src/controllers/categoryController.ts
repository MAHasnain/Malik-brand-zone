import { Request, Response } from "express";
import { Category } from "../models/category.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// 1. CREATE CATEGORY
export const createCategory = asyncHandler(
 async (req: Request, res: Response) => {
  const { name, slug, imageURL, isActive } = req.body;

  const existingCategory = await Category.findOne({ slug });
  if (existingCategory) {
   throw new ApiError(400, "Category slug already exists");
  }

  const category = await Category.create({ name, slug, imageURL, isActive });
  res
   .status(201)
   .json(new ApiResponse(201, category, "Category created successfully"));
 },
);

// 2. GET ALL CATEGORIES
export const getAllCategories = asyncHandler(
 async (req: Request, res: Response) => {
  const filter = req.query.isActive
   ? { isActive: req.query.isActive === "true" }
   : {};
  const categories = await Category.find(filter).sort({ createdAt: -1 });

  res
   .status(200)
   .json(new ApiResponse(200, categories, "Categories fetched successfully"));
 },
);

// 3. GET CATEGORY BY ID
export const getCategoryById = asyncHandler(
 async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
   throw new ApiError(404, "Category not found");
  }
  res
   .status(200)
   .json(new ApiResponse(200, category, "Category fetched successfully"));
 },
);

// 4. GET CATEGORY BY SLUG
export const getCategoryBySlug = asyncHandler(
 async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
   throw new ApiError(404, "Category not found");
  }
  res
   .status(200)
   .json(new ApiResponse(200, category, "Category fetched successfully"));
 },
);

// 5. UPDATE CATEGORY
export const updateCategory = asyncHandler(
 async (req: Request, res: Response) => {
  const { name, slug, imageURL, isActive } = req.body;

  if (slug) {
   const existingSlug = await Category.findOne({
    slug,
    _id: { $ne: req.params.id },
   });
   if (existingSlug) {
    throw new ApiError(400, "Slug already in use by another category");
   }
  }

  const category = await Category.findByIdAndUpdate(
   req.params.id,
   { name, slug, imageURL, isActive },
   { new: true, runValidators: true },
  );

  if (!category) {
   throw new ApiError(404, "Category not found");
  }

  res
   .status(200)
   .json(new ApiResponse(200, category, "Category updated successfully"));
 },
);

// 6. DELETE CATEGORY
export const deleteCategory = asyncHandler(
 async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
   throw new ApiError(404, "Category not found");
  }
  res
   .status(200)
   .json(new ApiResponse(200, {}, "Category deleted successfully"));
 },
);
