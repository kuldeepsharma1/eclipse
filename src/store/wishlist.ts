import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface WishlistItem extends Product {
  addedAt: string;
  notifyWhenAvailable?: boolean;
  notifyOnPriceChange?: {
    enabled: boolean;
    targetPrice: number;
  };
  notes?: string;
}

interface WishlistAnalytics {
  totalViews: number;
  totalShares: number;
  mostViewedItems: string[];
  lastViewed: string;
}

interface WishlistState {
  items: WishlistItem[];
  lists: {
    id: string;
    name: string;
    items: WishlistItem[];
    isPublic: boolean;
    shareUrl?: string;
  }[];
  analytics: WishlistAnalytics;
  
  // Item management
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  moveToList: (productId: string, fromListId: string, toListId: string) => void;
  updateItemNotes: (productId: string, notes: string) => void;
  toggleNotification: (productId: string, type: 'availability' | 'price') => void;
  setPriceAlert: (productId: string, targetPrice: number) => void;
  
  // List management
  createList: (name: string, isPublic?: boolean) => void;
  deleteList: (listId: string) => void;
  renameList: (listId: string, newName: string) => void;
  toggleListVisibility: (listId: string) => void;
  shareList: (listId: string) => Promise<string>;
  
  // Utility functions
  isInWishlist: (productId: string) => boolean;
  clearAll: () => void;
  exportWishlist: () => string;
  importWishlist: (data: string) => boolean;
  
  // Analytics
  incrementViews: (productId: string) => void;
  incrementShares: () => void;
  getAnalytics: () => WishlistAnalytics;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      lists: [{
        id: 'default',
        name: 'My Wishlist',
        items: [],
        isPublic: false,
      }],
      analytics: {
        totalViews: 0,
        totalShares: 0,
        mostViewedItems: [],
        lastViewed: new Date().toISOString(),
      },

      addItem: (product) => set((state) => {
        const newItem: WishlistItem = {
          ...product,
          addedAt: new Date().toISOString(),
        };
        return {
          items: [...state.items, newItem],
          lists: state.lists.map(list =>
            list.id === 'default'
              ? { ...list, items: [...list.items, newItem] }
              : list
          ),
        };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId),
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.filter(item => item.id !== productId),
        })),
      })),

      moveToList: (productId, fromListId, toListId) => set((state) => {
        const item = state.lists
          .find(list => list.id === fromListId)
          ?.items.find(item => item.id === productId);

        if (!item) return state;

        return {
          lists: state.lists.map(list => {
            if (list.id === fromListId) {
              return {
                ...list,
                items: list.items.filter(i => i.id !== productId),
              };
            }
            if (list.id === toListId) {
              return {
                ...list,
                items: [...list.items, item],
              };
            }
            return list;
          }),
        };
      }),

      updateItemNotes: (productId, notes) => set((state) => ({
        items: state.items.map(item =>
          item.id === productId ? { ...item, notes } : item
        ),
        lists: state.lists.map(list => ({
          ...list,
          items: list.items.map(item =>
            item.id === productId ? { ...item, notes } : item
          ),
        })),
      })),

      toggleNotification: (productId, type) => set((state) => ({
        items: state.items.map(item => {
          if (item.id !== productId) return item;
          if (type === 'availability') {
            return {
              ...item,
              notifyWhenAvailable: !item.notifyWhenAvailable,
            };
          }
          return {
            ...item,
            notifyOnPriceChange: {
              enabled: !item.notifyOnPriceChange?.enabled,
              targetPrice: item.notifyOnPriceChange?.targetPrice || item.price,
            },
          };
        }),
      })),

      setPriceAlert: (productId, targetPrice) => set((state) => ({
        items: state.items.map(item =>
          item.id === productId
            ? {
                ...item,
                notifyOnPriceChange: {
                  enabled: true,
                  targetPrice,
                },
              }
            : item
        ),
      })),

      createList: (name, isPublic = false) => set((state) => ({
        lists: [
          ...state.lists,
          {
            id: `list-${Date.now()}`,
            name,
            items: [],
            isPublic,
          },
        ],
      })),

      deleteList: (listId) => set((state) => ({
        lists: state.lists.filter(list => list.id !== listId),
      })),

      renameList: (listId, newName) => set((state) => ({
        lists: state.lists.map(list =>
          list.id === listId ? { ...list, name: newName } : list
        ),
      })),

      toggleListVisibility: (listId) => set((state) => ({
        lists: state.lists.map(list =>
          list.id === listId ? { ...list, isPublic: !list.isPublic } : list
        ),
      })),

      shareList: async (listId) => {
        const state = get();
        const list = state.lists.find(l => l.id === listId);
        if (!list || !list.isPublic) return '';
        
        // In a real app, this would make an API call to generate a sharing URL
        const shareUrl = `https://eclipse.store/wishlist/${listId}`;
        set(state => ({
          lists: state.lists.map(l =>
            l.id === listId ? { ...l, shareUrl } : l
          ),
          analytics: {
            ...state.analytics,
            totalShares: state.analytics.totalShares + 1,
          },
        }));
        
        return shareUrl;
      },

      isInWishlist: (productId) => {
        const state = get();
        return state.items.some((item) => item.id === productId);
      },

      clearAll: () => set({ items: [], lists: [], analytics: {
        totalViews: 0,
        totalShares: 0,
        mostViewedItems: [],
        lastViewed: new Date().toISOString(),
      }}),

      exportWishlist: () => {
        const state = get();
        return JSON.stringify({
          items: state.items,
          lists: state.lists,
        });
      },

      importWishlist: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            items: parsed.items || [],
            lists: parsed.lists || [],
          });
          return true;
        } catch {
          return false;
        }
      },

      incrementViews: () => set((state) => {
        const analytics = { ...state.analytics };
        analytics.totalViews++;
        analytics.lastViewed = new Date().toISOString();
        
        // Update most viewed items
        const viewCounts = new Map<string, number>();
        state.items.forEach(item => {
          const currentCount = viewCounts.get(item.id) || 0;
          viewCounts.set(item.id, currentCount + 1);
        });
        
        analytics.mostViewedItems = Array.from(viewCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);
        
        return { analytics };
      }),

      incrementShares: () => set((state) => ({
        analytics: {
          ...state.analytics,
          totalShares: state.analytics.totalShares + 1,
        },
      })),

      getAnalytics: () => get().analytics,
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
