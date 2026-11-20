import { api } from "@/lib/axios";
import { IProduct, ICategory, IOrder, ApiResponse } from "@/types";

// 1. PRODUCT API CALLS

// Get All Products (Admin View)
export async function getAllProductsAdminApi(): Promise<IProduct[]> {
  const res = await api.get<ApiResponse<IProduct[]>>("/products");
  return res.data.data || res.data || [];
}

// Get Single Product By ID
export async function getProductByIdApi(productId: string): Promise<IProduct> {
  const res = await api.get<ApiResponse<IProduct>>(`/products/${productId}`);
  return res.data.data;
}

// Create New Product
export async function createProductApi(
  productData: Partial<IProduct>
): Promise<IProduct> {
  const res = await api.post<ApiResponse<IProduct>>("/products", productData);
  return res.data.data;
}

// Update Existing Product
export async function updateProductApi(
  productId: string,
  productData: Partial<IProduct>
): Promise<IProduct> {
  const res = await api.put<ApiResponse<IProduct>>(
    `/products/${productId}`,
    productData
  );
  return res.data.data;
}

// Delete Product
export async function deleteProductApi(productId: string): Promise<boolean> {
  await api.delete(`/products/${productId}`);
  return true;
}

// 2. CATEGORY API CALLS

type CategoryInput = {
  name: string;
  slug?: string;
  image?: string;
  imageURL?: string;
  isActive?: boolean;
};

function categoryPayload(input: CategoryInput, mode: "create" | "update") {
  const name = input.name.trim();
  if (!name) throw new Error("Enter a category name.");

  const source = input.slug?.trim() || (mode === "create" ? name : undefined);
  const slug = source?.normalize("NFC").toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}_-]+/gu, "-")
    .replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (source && !slug) throw new Error("Enter a valid category slug.");

  return {
    name,
    ...(slug && { slug }),
    imageURL: input.imageURL ?? input.image,
    isActive: input.isActive,
  };
}

export async function getAllCategoriesApi(): Promise<ICategory[]> {
  const { data } = await api.get<ApiResponse<ICategory[]> | ICategory[]>("/categories");
  const categories = Array.isArray(data) ? data : data.data;
  if (!Array.isArray(categories)) throw new Error("Invalid category list response.");
  return categories;
}

export async function createCategoryApi(categoryData: CategoryInput): Promise<ICategory> {
  const res = await api.post<ApiResponse<ICategory>>(
    "/categories",
    categoryPayload(categoryData, "create")
  );
  return res.data.data;
}

export async function updateCategoryApi(
  categoryId: string,
  categoryData: CategoryInput
): Promise<ICategory> {
  const res = await api.patch<ApiResponse<ICategory>>(
    `/categories/${categoryId}`,
    categoryPayload(categoryData, "update")
  );
  return res.data.data;
}

// Delete Category
export async function deleteCategoryApi(id: string): Promise<boolean> {
  await api.delete(`/categories/${id}`);
  return true;
}

// 3. ORDER MANAGEMENT API CALLS

export type Dashboard = {
  revenue: number; orders: number; activeProducts: number; customers: number;
  recentOrders: { _id: string; orderId: string; totalAmount: number; customerInfo: { fullName: string }; orderStatus: string }[];
};
export const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;
export type Status = typeof statuses[number];
export type Order = {
  _id: string; orderId: string; orderStatus: Status; totalAmount: number;
  paymentMethod: string; paymentStatus: string;
  customerInfo: { fullName: string; phone: string; city: string; address: string };
  orderItems: { title: string; size?: string; color?: string; quantity: number }[];
};
export type Orders = { orders: Order[]; totalPages: number; total: number };

export async function getDashboardApi(signal?: AbortSignal) {
  const response = await api.get<ApiResponse<Dashboard>>("/orders/dashboard", { signal });
  return response.data.data;
}

export async function getOrdersPageApi(page = 1, status?: string, signal?: AbortSignal): Promise<Orders> {
  const response = await api.get<ApiResponse<Orders>>("/orders", { params: { page, limit: 10, status }, signal });
  if (!Array.isArray(response.data.data?.orders)) throw new Error("Invalid orders response");
  return response.data.data;
}

export async function getAllOrdersApi(): Promise<IOrder[]> {
  const response = await api.get<ApiResponse<{ orders: IOrder[] }>>("/orders");
  return response.data.data.orders;
}

export async function updateOrderStatusApi(id: string, status: string): Promise<IOrder> {
  const orderStatus = status === "Processing" ? "Confirmed" : status;
  const response = await api.put<ApiResponse<IOrder>>(`/orders/${id}/status`, { orderStatus });
  return response.data.data;
}

// Delete / Cancel Order
export async function deleteOrderApi(orderId: string): Promise<boolean> {
  await api.delete(`/orders/${orderId}`);
  return true;
}

// 4. IMAGE UPLOAD / UTILITY API

// Upload Image File to Cloudinary / Server
export async function uploadImageApi(formData: FormData): Promise<string> {
  const res = await api.post<ApiResponse<{ url: string }>>(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.data.url;
}
