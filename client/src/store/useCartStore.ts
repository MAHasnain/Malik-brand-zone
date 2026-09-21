import { create } from 'zustand';
import { api } from '@/lib/axios';
import { getOrCreateSessionId } from '@/utils/session';

export interface ICartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    discountPrice?: number;
    slug: string;
    stock: number;
  };
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart {
  _id?: string;
  sessionId?: string;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

interface CartStoreState {
  cart: ICart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // API Calls
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, size?: string, color?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  cart: null,
  isLoading: false,
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  // 1. Fetch Cart from Backend
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const sessionId = getOrCreateSessionId();
      if (!sessionId) return;

      const response = await api.get(`/cart?sessionId=${sessionId}`);
      
      if (response.data?.data) {
        set({ cart: response.data.data });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Add Item to Cart
  addToCart: async (productId, size, color, quantity = 1) => {
    set({ isLoading: true });
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.post('/cart/add', {
        productId,
        size,
        color,
        quantity,
        sessionId,
      });

      if (response.data?.data) {
        set({ cart: response.data.data, isDrawerOpen: true }); // Cart add hone par automatically drawer slide-in hoga
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. Update Cart Item Quantity
  updateQuantity: async (itemId, quantity) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.patch('/cart/update-qty', {
        itemId,
        quantity,
        sessionId,
      });

      if (response.data?.data) {
        set({ cart: response.data.data });
      }
    } catch (error: any) {
      console.error('Error updating cart quantity:', error);
      alert(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  // 4. Remove Item from Cart
  removeItem: async (itemId) => {
    try {
      const sessionId = getOrCreateSessionId();
      const response = await api.post('/cart/remove', {
        itemId,
        sessionId,
      });

      if (response.data?.data) {
        set({ cart: response.data.data });
      }
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  },

  // 5. Clear Entire Cart
  clearCart: async () => {
    try {
      const sessionId = getOrCreateSessionId();
      await api.post('/cart/clear', { sessionId });
      set({ cart: { items: [], totalPrice: 0, totalItems: 0 } });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
    }
  },
}));