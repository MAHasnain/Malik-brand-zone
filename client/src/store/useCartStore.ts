/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { api } from "@/lib/axios";
import { IProduct } from "@/types";

export interface ICartItem {
  product: IProduct;
  size: string;
  color: string;
  quantity: number;
}

interface CartStoreState {
  cart: {
    items: ICartItem[];
    totalPrice: number;
    totalItems: number;
  } | null;
  loading: boolean;
  addToCart: (item: { product: IProduct; size: string; color: string; quantity: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("cart_session_id", sessionId);
  }
  return sessionId;
};

export const useCartStore = create<CartStoreState>((set) => ({
  cart: null,
  loading: false,

  addToCart: async ({ product, size, color, quantity }) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.post("/cart/add", {
        productId: product._id,
        size,
        color,
        quantity,
        sessionId,
      });

      const resData = response.data as Record<string, any>;
      if (resData?.data) {
        set({ cart: resData.data });
      }
    } catch (error: unknown) {
      const err = error as Record<string, any>;
      console.error("Error adding to cart:", error);
      alert(err.response?.data?.message || "Failed to add item to cart");
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.put("/cart/update", {
        itemId,
        quantity,
        sessionId,
      });

      const resData = response.data as Record<string, any>;
      if (resData?.data) {
        set({ cart: resData.data });
      }
    } catch (error: unknown) {
      const err = error as Record<string, any>;
      console.error("Error updating cart quantity:", error);
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.post("/cart/remove", {
        itemId,
        sessionId,
      });

      const resData = response.data as Record<string, any>;
      if (resData?.data) {
        set({ cart: resData.data });
      }
    } catch (error: unknown) {
      const err = error as Record<string, any>;
      console.error("Error removing item from cart:", error);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      const sessionId = getOrCreateSessionId();
      await api.post("/cart/clear", { sessionId });
      set({ cart: { items: [], totalPrice: 0, totalItems: 0 } });
    } catch (error: unknown) {
      console.error("Error clearing cart:", error);
    }
  },
}));