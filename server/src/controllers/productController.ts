import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadToCloudinary } from "../utils/cloudinary";

// 1. CREATE PRODUCT

export const createProduct = asyncHandler(
 async (req: Request, res: Response) => {
  const {
   title,
   slug,
   description,
   price,
   discountPrice,
   category,
   fabric,
   sizes,
   colors,
   stock,
   isFeatured,
  } = req.body;

  // 2. Validate Slug uniqueness
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
   throw new ApiError(400, "Product slug already exists");
  }

  // 3. Handle Image Uploads concurrently
  const imageUrls: string[] = [];
  if (req.files && Array.isArray(req.files)) {
   const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.buffer, "Products"),
   );
   const results = await Promise.all(uploadPromises);
   imageUrls.push(...results);
  }

  if (imageUrls.length === 0) {
   throw new ApiError(400, "At least one product image is required");
  }

  // 4. Parse FormData Strings back to proper JS Types (Arrays, Numbers, Booleans)
  const parsedSizes =
   typeof sizes === "string" ? sizes.split(",").map((s) => s.trim()) : sizes;
  const parsedColors =
   typeof colors === "string" ? colors.split(",").map((c) => c.trim()) : colors;

  // 5. Construct the final object safely
  const productData = {
   title,
   slug,
   description,
   price: Number(price),
   discountPrice: discountPrice ? Number(discountPrice) : undefined,
   category,
   fabric,
   sizes: parsedSizes || [],
   colors: parsedColors || [],
   stock: Number(stock) || 0,
   isFeatured: isFeatured === "true" || isFeatured === true,
   images: imageUrls,
  };

  // 6. Save to Database
  const product = await Product.create(productData);

  res
   .status(201)
   .json(new ApiResponse(201, product, "Product created successfully"));
 },
);

// 2. GET ALL PRODUCTS
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
 const {
  search,
  category,
  fabric,
  sizes,
  minPrice,
  maxPrice,
  isFeatured,
  sort,
  page,
  limit,
 } = req.query;
 let queryObj: any = {};

 // 1. Search Sanitization (Preventing ReDoS by escaping special regex characters)
 if (search) {
  const safeSearch = (search as string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  queryObj.title = { $regex: safeSearch, $options: "i" };
 }

 // 2. Category Validation
 if (category) {
  const categoryDoc = await Category.findOne({ slug: category as string });
  if (categoryDoc) {
   queryObj.category = categoryDoc._id;
  } else {
   // Return early with empty array instead of throwing error for better UX
   return res
    .status(200)
    .json(
     new ApiResponse(
      200,
      { products: [], total: 0, totalPages: 0, currentPage: 1 },
      "No matching category found",
     ),
    );
  }
 }

 // 3. Array Fields Handling
 if (fabric)
  queryObj.fabric = { $in: (fabric as string).split(",").map((f) => f.trim()) };
 if (sizes)
  queryObj.sizes = { $in: (sizes as string).split(",").map((s) => s.trim()) };

 // 4. Boolean Validation
 if (isFeatured !== undefined) {
  if (isFeatured !== "true" && isFeatured !== "false") {
   throw new ApiError(
    400,
    "isFeatured parameter must be strictly 'true' or 'false'",
   );
  }
  queryObj.isFeatured = isFeatured === "true";
 }

 // 5. Price Range Validations
 if (minPrice !== undefined || maxPrice !== undefined) {
  const min = minPrice ? Number(minPrice) : 0;
  const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

  if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
   throw new ApiError(
    400,
    "Price filter values must be valid positive numbers",
   );
  }
  if (min > max) {
   throw new ApiError(400, "minPrice cannot be greater than maxPrice");
  }

  queryObj.price = { $gte: min, $lte: max };
 }

 let mongooseQuery = Product.find(queryObj).populate("category", "name slug");

 // 6. Sort Validation (Whitelist only specific fields to prevent exposing internal fields)
 if (sort) {
  const allowedSortFields = [
   "price",
   "-price",
   "createdAt",
   "-createdAt",
   "title",
   "-title",
  ];
  const sortFields = (sort as string).split(",");

  // Filter out any sort fields that are not in our whitelist
  const validSorts = sortFields.filter((field) =>
   allowedSortFields.includes(field.trim()),
  );

  if (validSorts.length > 0) {
   mongooseQuery = mongooseQuery.sort(validSorts.join(" "));
  } else {
   mongooseQuery = mongooseQuery.sort("-createdAt");
  }
 } else {
  mongooseQuery = mongooseQuery.sort("-createdAt"); // Default sort
 }

 // 7. Pagination Validation & Hard Limits (Preventing memory crashes)
 let pageNum = parseInt(page as string, 10);
 let limitNum = parseInt(limit as string, 10);

 pageNum = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
 limitNum = isNaN(limitNum) || limitNum < 1 ? 12 : limitNum;

 // Never allow fetching more than 100 products at once
 if (limitNum > 100) limitNum = 100;

 const skip = (pageNum - 1) * limitNum;
 mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);

 // Execute queries in parallel for performance
 const [products, totalDocs] = await Promise.all([
  mongooseQuery,
  Product.countDocuments(queryObj),
 ]);

 const paginationData = {
  products,
  total: totalDocs,
  totalPages: Math.ceil(totalDocs / limitNum),
  currentPage: pageNum,
 };

 res
  .status(200)
  .json(new ApiResponse(200, paginationData, "Products fetched successfully"));
});

// 3. GET PRODUCT BY ID
export const getProductById = asyncHandler(
 async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate(
   "category",
   "name slug",
  );
  if (!product) throw new ApiError(404, "Product not found");
  res
   .status(200)
   .json(new ApiResponse(200, product, "Product fetched successfully"));
 },
);

// 4. GET PRODUCT BY SLUG
export const getProductBySlug = asyncHandler(
 async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
   "category",
   "name slug",
  );
  if (!product) throw new ApiError(404, "Product not found");
  res
   .status(200)
   .json(new ApiResponse(200, product, "Product fetched successfully"));
 },
);

// 5. UPDATE PRODUCT
// 5. UPDATE PRODUCT
export const updateProduct = asyncHandler(
 async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
   throw new ApiError(404, "Product not found");
  }

  const {
   title,
   slug,
   description,
   price,
   discountPrice,
   category,
   fabric,
   sizes,
   colors,
   stock,
   isFeatured,
   retainedImages, // Frontend should send an array of existing image URLs the user DID NOT delete
  } = req.body;

  // 1. Validate Slug Uniqueness (if it's being changed)
  if (slug && slug !== product.slug) {
   const existingSlug = await Product.findOne({ slug });
   if (existingSlug) {
    throw new ApiError(400, "Slug already in use by another product");
   }
  }

  // 2. Parse FormData Strings back to proper JS Types
  const parsedSizes =
   typeof sizes === "string" ? sizes.split(",").map((s) => s.trim()) : sizes;
  const parsedColors =
   typeof colors === "string" ? colors.split(",").map((c) => c.trim()) : colors;

  // 3. Image Management Logic
  let finalImages: string[] = [];

  // A. Add retained existing images
  if (retainedImages) {
   finalImages = Array.isArray(retainedImages)
    ? retainedImages
    : [retainedImages];
  }

  // B. Upload and append any brand NEW images
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
   const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.buffer, "Products"),
   );
   const newImageUrls = await Promise.all(uploadPromises);
   finalImages = [...finalImages, ...newImageUrls];
  }

  // C. Fallback: If no files were uploaded and no retainedImages array was sent, keep original images
  if (finalImages.length === 0 && (!req.files || req.files.length === 0)) {
   finalImages = product.images;
  }

  if (finalImages.length === 0) {
   throw new ApiError(400, "A product must have at least one image");
  }

  // 4. Construct updated payload (fallback to existing values if not provided in request)
  const updatedData = {
   title: title || product.title,
   slug: slug || product.slug,
   description: description || product.description,
   price: price ? Number(price) : product.price,
   discountPrice: discountPrice ? Number(discountPrice) : product.discountPrice,
   category: category || product.category,
   fabric: fabric || product.fabric,
   sizes: parsedSizes || product.sizes,
   colors: parsedColors || product.colors,
   stock: stock !== undefined ? Number(stock) : product.stock,
   isFeatured:
    isFeatured !== undefined
     ? isFeatured === "true" || isFeatured === true
     : product.isFeatured,
   images: finalImages,
  };

  const updatedProduct = await Product.findByIdAndUpdate(
   req.params.id,
   updatedData,
   {
    new: true,
    runValidators: true,
   },
  ).populate("category", "name slug");

  res
   .status(200)
   .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
 },
);

// 6. DELETE PRODUCT
export const deleteProduct = asyncHandler(
 async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res
   .status(200)
   .json(new ApiResponse(200, {}, "Product deleted successfully"));
 },
);
