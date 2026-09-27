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
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    itemOrProduct: any,
    size?: string,
    color?: string,
    quantity?: number
  ) => Promise<void>;
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
  isOpen: false, // Default hidden

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addToCart: async (itemOrProduct: any, size?: string, color?: string, quantity: number = 1) => {
    try {
      let productObj: IProduct;
      let selectedSize = size || "";
      let selectedColor = color || "";
      let qty = quantity;

      if (itemOrProduct && typeof itemOrProduct === "object" && "product" in itemOrProduct) {
        productObj = itemOrProduct.product;
        selectedSize = itemOrProduct.size || selectedSize;
        selectedColor = itemOrProduct.color || selectedColor;
        qty = itemOrProduct.quantity || qty;
      } else {
        productObj = itemOrProduct;
      }

      const productId = productObj?._id || productObj;
      const sessionId = getOrCreateSessionId();

      const response = await api.post("/cart/add", {
        productId,
        size: selectedSize,
        color: selectedColor,
        quantity: qty,
        sessionId,
      });

      const resData = response.data as Record<string, any>;
      if (resData?.data) {
        set({ cart: resData.data, isOpen: true }); // Automatically open drawer after adding!
      }
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.put("/cart/update", { itemId, quantity, sessionId });
      const resData = response.data as Record<string, any>;
      if (resData?.data) set({ cart: resData.data });
    } catch (error: unknown) {
      console.error("Error updating cart quantity:", error);
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.post("/cart/remove", { itemId, sessionId });
      const resData = response.data as Record<string, any>;
      if (resData?.data) set({ cart: resData.data });
    } catch (error: unknown) {
      console.error("Error removing item from cart:", error);
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