import { create } from 'zustand';
import { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  addWishlistItem: (item: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  addWishlistItem: (item) =>
    set((state) => ({
      items: state.items.find((i) => i.id === item.id)
        ? state.items
        : [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  isInWishlist: (id) => get().items.some((item) => item.id === id),
}));
