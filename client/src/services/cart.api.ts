import { api } from "@/lib/axios";
import { ICart, ApiResponse } from "@/types";

// 1. Get Cart
export async function fetchCartApi(sessionId: string): Promise<ICart | null> {
  try {
    const res = await api.get<ApiResponse<ICart>>(`/cart?sessionId=${sessionId}`);
    return res.data.data;
  } catch (error) {
    console.error("fetchCartApi Error:", error);
    return null;
  }
}

// 2. Add Item to Cart
export async function addToCartApi(payload: {
  productId: string;
  size?: string;
  color?: string;
  quantity: number;
  sessionId: string;
}): Promise<ICart> {
  const res = await api.post<ApiResponse<ICart>>("/cart/add", payload);
  return res.data.data;
}

// 3. Update Cart Item Quantity
export async function updateCartQtyApi(payload: {
  itemId: string;
  quantity: number;
  sessionId: string;
}): Promise<ICart> {
  const res = await api.patch<ApiResponse<ICart>>("/cart/update-qty", payload);
  return res.data.data;
}

// 4. Remove Item from Cart
export async function removeCartItemApi(payload: {
  itemId: string;
  sessionId: string;
}): Promise<ICart> {
  const res = await api.post<ApiResponse<ICart>>("/cart/remove", payload);
  return res.data.data;
}

// 5. Clear Entire Cart
export async function clearCartApi(sessionId: string): Promise<boolean> {
  await api.post("/cart/clear", { sessionId });
  return true;
}