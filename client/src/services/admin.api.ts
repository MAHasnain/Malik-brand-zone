import { api } from "@/lib/axios";
import { IProduct, ICategory, ApiResponse } from "@/types";

// 1. Create New Product
export async function createProductApi(productData: Partial<IProduct>): Promise<IProduct> {
  const res = await api.post<ApiResponse<IProduct>>("/products", productData);
  return res.data.data;
}

// 2. Delete Product
export async function deleteProductApi(productId: string): Promise<boolean> {
  await api.delete(`/products/${productId}`);
  return true;
}

// 3. Create New Category
export async function createCategoryApi(categoryData: { name: string; image?: string }): Promise<ICategory> {
  const res = await api.post<ApiResponse<ICategory>>("/categories", categoryData);
  return res.data.data;
}