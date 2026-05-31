import { create } from 'zustand';
import type { Cart } from '@ecommerce/shared';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../api/cart.api';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  isDrawerOpen: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await getCart();
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    const cart = await addItem(productId, quantity);
    set({ cart, isDrawerOpen: true });
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const cart = await updateItem(productId, quantity);
    set({ cart });
  },

  removeFromCart: async (productId: string) => {
    const cart = await removeItem(productId);
    set({ cart });
  },

  clearCart: async () => {
    await clearCart();
    set({ cart: null });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
